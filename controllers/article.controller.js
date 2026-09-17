const axios = require("axios");
const { CatchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../config/ErrorHandler");
const articleModel = require("../models/article.model");
const { redis } = require("../config/redis");

const generateArticleSlug = (title) =>
  title
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueArticleSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let count = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    if (!(await articleModel.findOne(query))) return slug;
    slug = `${baseSlug}-${count++}`;
  }
};

const clearArticleCache = async (article) =>
  Promise.all([
    redis.del("allArticles"),
    redis.del("allPublishedArticles"),
    redis.del(`article_${article._id}`),
    redis.del(`article_${article.slug}`),
  ]);

exports.uploadArticle = CatchAsyncError(async (req, res, next) => {
  try {
    const {
      title,
      heading,
      content,
      source,
      subheading,
      image,
      category,
      author,
      status,
      url,
    } = req.body;
    if (!title) return next(new ErrorHandler("Thiếu tiêu đề bài viết.", 400));
    if (!content)
      return next(new ErrorHandler("Thiếu nội dung bài viết.", 400));

    const article = await articleModel.create({
      title,
      slug: await ensureUniqueArticleSlug(generateArticleSlug(title)),
      heading,
      content,
      source,
      image,
      subheading,
      category,
      author: author || req.user?.fullName || "Admin",
      status: status !== undefined ? status : true,
      url,
    });
    await clearArticleCache(article);
    res.status(201).json({ success: true, article });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.editArticle = CatchAsyncError(async (req, res, next) => {
  try {
    const articleId = req.params.id || req.body.id || req.body._id;
    if (!articleId)
      return next(new ErrorHandler("Thiếu ID bài viết để cập nhật.", 400));
    const article = await articleModel.findById(articleId);
    if (!article)
      return next(new ErrorHandler("Không tồn tại bài viết này.", 404));

    const previousSlug = article.slug;
    const {
      title,
      heading,
      content,
      source,
      subheading,
      category,
      author,
      status,
      url,
    } = req.body;
    if (title && title !== article.title) {
      article.title = title;
      article.slug = await ensureUniqueArticleSlug(
        generateArticleSlug(title),
        articleId,
      );
    }
    for (const [field, value] of Object.entries({
      heading,
      content,
      source,
      subheading,
      category,
      author,
      status,
      url,
    })) {
      if (value !== undefined) article[field] = value;
    }
    await article.save();
    await clearArticleCache(article);
    if (previousSlug !== article.slug)
      await redis.del(`article_${previousSlug}`);
    res.status(200).json({ success: true, article });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.getAllArticlesNoPagination = CatchAsyncError(async (req, res, next) => {
  try {
    const cachedArticles = await redis.get("allArticles");
    if (cachedArticles)
      return res
        .status(200)
        .json({ success: true, articles: JSON.parse(cachedArticles) });
    const articles = await articleModel.find().sort({ createdAt: -1 });
    await redis.set("allArticles", JSON.stringify(articles));
    res.status(200).json({ success: true, articles });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.formatArticleContent = CatchAsyncError(async (req, res, next) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const content =
    typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!content) return next(new ErrorHandler("Thiếu nội dung bài viết.", 400));
  if (!process.env.GEMINI_API_KEY)
    return res.status(200).json({
      success: true,
      formattedTitle: title,
      formattedContent: content,
      provider: "local",
    });
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Chuẩn hóa bài viết sau thành HTML semantic, dễ đọc và đẹp. Chỉ trả về JSON hợp lệ với đúng hai khóa "title" và "content". "title" là tiêu đề ngắn gọn, giữ đúng ý chính; "content" chỉ được dùng các thẻ h2, h3, p, strong, em, ul, ol, li, blockquote, figure, img, figcaption, a, br, không markdown và không giải thích. Giữ nguyên nội dung, URL ảnh và liên kết. Tiêu đề hiện tại: ${title}\nNội dung:\n${content}`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
      },
      { timeout: 30000 },
    );
    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let formattedTitle = title;
    let formattedContent = text || content;
    try {
      const parsed = JSON.parse(
        text
          .replace(/^```json\s*/i, "")
          .replace(/\s*```$/, "")
          .trim(),
      );
      formattedTitle = parsed.title || title;
      formattedContent = parsed.content || content;
    } catch {
      formattedContent = text || content;
    }
    return res.status(200).json({
      success: true,
      formattedTitle,
      formattedContent: formattedContent
        .replace(/^```html\s*/i, "")
        .replace(/\s*```$/, "")
        .trim(),
      provider: "gemini",
    });
  } catch (error) {
    console.error(
      "Gemini format error:",
      error.response?.data || error.message,
    );
    return res.status(200).json({
      success: true,
      formattedTitle: title,
      formattedContent: content,
      provider: "local-fallback",
    });
  }
});

exports.getAllPublishedArticlesNoPagination = CatchAsyncError(
  async (req, res, next) => {
    try {
      const cachedArticles = await redis.get("allPublishedArticles");
      if (cachedArticles)
        return res
          .status(200)
          .json({ success: true, articles: JSON.parse(cachedArticles) });
      const articles = await articleModel
        .find({ status: true })
        .sort({ createdAt: -1 });
      await redis.set("allPublishedArticles", JSON.stringify(articles));
      res.status(200).json({ success: true, articles });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

exports.getSingleArticle = CatchAsyncError(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cacheKey = `article_${slug}`;
    const cachedArticle = await redis.get(cacheKey);
    if (cachedArticle)
      return res
        .status(200)
        .json({ success: true, article: JSON.parse(cachedArticle) });
    const article = await articleModel.findOneAndUpdate(
      { slug },
      { $inc: { viewed: 1 } },
      { returnDocument: "after" },
    );
    if (!article)
      return next(new ErrorHandler("Không tồn tại bài viết này.", 404));
    await redis.set(cacheKey, JSON.stringify(article));
    res.status(200).json({ success: true, article });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.getArticleBySlug = exports.getSingleArticle;

exports.getLatestArticles = CatchAsyncError(async (req, res, next) => {
  try {
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const latestArticles = await articleModel
      .find({ status: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json({ success: true, latestArticles });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.getMostViewedArticles = CatchAsyncError(async (req, res, next) => {
  try {
    const limit = Math.max(parseInt(req.query.limit, 5) || 5, 1);
    const mostViewedArticles = await articleModel
      .find({ status: true })
      .sort({ viewed: -1 })
      .limit(limit);
    res.status(200).json({ success: true, mostViewedArticles });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.getAllArticleCategories = CatchAsyncError(async (req, res, next) => {
  try {
    const categories = await articleModel.distinct("category");
    res.status(200).json({ success: true, categories });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.deleteArticle = CatchAsyncError(async (req, res, next) => {
  try {
    const article = await articleModel.findByIdAndDelete(req.params.id);
    if (!article)
      return next(new ErrorHandler("Không tồn tại bài viết này để xóa.", 404));
    await clearArticleCache(article);
    res.status(200).json({ success: true, article });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.deleteAllArticles = CatchAsyncError(async (req, res, next) => {
  try {
    await articleModel.deleteMany({});
    await Promise.all([
      redis.del("allArticles"),
      redis.del("allPublishedArticles"),
    ]);
    res
      .status(200)
      .json({ success: true, message: "Tất cả bài viết đã được xóa." });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
