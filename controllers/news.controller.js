const { CatchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../config/ErrorHandler");
const newsModel = require("../models/news.model");
const { redis } = require("../config/redis");
const axios = require("axios");
const cheerio = require("cheerio");
const { convert } = require("html-to-text");
const { after } = require("node:test");

// Tạo slug từ title (không dấu, viết thường, nối bằng dấu -)
const generateSlug = (title) => {
  return title
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Đảm bảo slug là duy nhất, nếu trùng thì thêm hậu tố số
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await newsModel.findOne(query);
    if (!exists) break;

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

// Hàm phụ: lấy nội dung chi tiết từ 1 bài viết, bỏ qua mọi bảng <table> bên trong #vst_detail
async function fetchArticleContent(url) {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  // clone() để không làm thay đổi DOM gốc, phòng khi cần dùng $ cho việc khác sau này
  const detailEl = $("#vst_detail");

  const sourceText = detailEl.find(".pSource > a").attr("href");
  const dateText = detailEl
    .find(".pPublishTimeSource")
    .text()
    .replace("-", "")
    .trim();
  const authorText = detailEl.find(".pAuthor").text();

  const content = convert(html, {
    baseElements: { selectors: ["#vst_detail"] },
    selectors: [
      { selector: "table", format: "skip" },
      { selector: ".pTitle", format: "skip" },
      { selector: "img", format: "skip" },
      { selector: ".pSource", format: "skip" },
      { selector: ".pAuthor", format: "skip" },
      { selector: ".pPublishTimeSource", format: "skip" },
      { selector: "a", options: { ignoreHref: true } }, // giữ text link, bỏ URL
    ],
  });

  // Chuẩn hóa khoảng trắng/xuống dòng thừa cho gọn
  //const content = detailEl.text().replace(/\s+/g, " ").trim();

  return {
    postSource: sourceText,
    postDate: dateText,
    postContent: content.trim(),
    postAuthor: authorText,
  };
}

// Upload (tạo mới) tin tức - Done
exports.uploadNews = CatchAsyncError(async (req, res, next) => {
  try {
    const {
      postTitle,
      postImage,
      postHeading,
      postContent,
      category,
      postDate,
      postAuthor,
      status,
    } = req.body;
    const author = postAuthor || (req.user && req.user.fullName) || "Admin";

    if (!postTitle) {
      return next(new ErrorHandler("Thiếu title", 400));
    }
    if (!postContent) {
      return next(new ErrorHandler("Thiếu content", 400));
    }

    const baseSlug = generateSlug(postTitle);
    const slug = await ensureUniqueSlug(baseSlug);

    const news = await newsModel.create({
      postTitle,
      slug,
      postImage,
      postHeading,
      postContent,
      category,
      postDate,
      postAuthor: author,
      status: status !== undefined ? status : true,
    });

    await redis.del("allNews");
    await redis.del("allPublishedNews");

    res.status(201).json({
      success: true,
      news,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Sửa tin tức - check
exports.editNews = CatchAsyncError(async (req, res, next) => {
  try {
    const newsId = req.params.id || req.body.id || req.body._id;
    if (!newsId) {
      return next(new ErrorHandler("Thiếu ID bài viết để cập nhật.", 400));
    }

    const {
      postTitle,
      postImage,
      postHeading,
      postContent,
      category,
      postAuthor,
      postDate,
      status,
    } = req.body;

    const news = await newsModel.findById(newsId);
    if (!news) {
      return next(new ErrorHandler("Không tồn tại tin tức này.", 404));
    }

    if (postTitle && postTitle !== news.postTitle) {
      news.postTitle = postTitle;
      const baseSlug = generateSlug(postTitle);
      news.slug = await ensureUniqueSlug(baseSlug, newsId);
    }

    if (postImage !== undefined) news.postImage = postImage;
    if (postHeading !== undefined) news.postHeading = postHeading;
    if (postContent !== undefined) news.postContent = postContent;
    if (category !== undefined) news.category = category;
    if (postAuthor !== undefined) news.postAuthor = postAuthor;
    if (postDate !== undefined) news.postDate = postDate;
    if (status !== undefined) news.status = status;

    await news.save();

    await Promise.all([
      redis.del("allNews"),
      redis.del("allPublishedNews"),
      redis.del(`news_${newsId}`),
      redis.del(`news_${news.slug}`),
      redis.del(`news_slug_${news.slug}`),
    ]);

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy tin tức từ website khác (vietstock.vn) và lưu vào database - Done
exports.getNewsFromOtherWebsite = CatchAsyncError(async (req, res, next) => {
  try {
    const { data: html } = await axios.get(process.env.URL_WEBSITE_NEWS);
    const $ = cheerio.load(html);

    const elements = $(".channelContent").toArray();
    //console.log("1. Số phần tử .channelContent tìm được:", elements.length);
    const thumbnail = [];
    let skippedNoSlug = 0;
    let skippedExisted = 0;

    for (const el of elements) {
      const $el = $(el);
      const postImage = $el.find("a > img").attr("data-src");
      const postTitle = $el.find("a > img").attr("alt");
      const postHeading = $el.find("p").text().trim();
      const slugUrl = $el.find("a").attr("href");

      if (!slugUrl) {
        skippedNoSlug++;
        continue;
      }

      const fullSlugUrl = slugUrl.startsWith("http")
        ? slugUrl
        : `https://vietstock.vn${slugUrl}`;

      // Kiểm tra trùng TRƯỚC khi gọi sang trang chi tiết -> tiết kiệm request không cần thiết
      const existed = await newsModel.exists({ postTitle: postTitle });
      if (existed) {
        skippedExisted++;
        continue;
      }

      const baseSlug = generateSlug(postTitle);
      const slug = await ensureUniqueSlug(baseSlug);

      // Gọi sang trang chi tiết để lấy nội dung đầy đủ; nếu lỗi thì bỏ qua nội dung,
      // vẫn giữ lại phần thumbnail đã lấy được thay vì loại bỏ cả bài
      let content = "";
      try {
        const { postSource, postDate, postContent, postAuthor } =
          await fetchArticleContent(fullSlugUrl);

        thumbnail.push({
          postImage,
          postTitle,
          postHeading,
          postContent,
          postSource,
          postDate,
          postAuthor,
          url: fullSlugUrl,
          slug,
        });
        console.log(`Lấy nội dung chi tiết thành công`);
      } catch (err) {
        console.error(
          `Lỗi khi lấy nội dung chi tiết (${fullSlugUrl}):`,
          err.message,
        );
      }
    }

    if (thumbnail.length === 0) {
      return res.status(200).json({
        news: [],
        success: true,
        message: "Không có bài viết mới",
      });
    }

    const news = await newsModel.insertMany(thumbnail.reverse(), {
      ordered: false,
    });

    await redis.del("allNews");
    await redis.del("allPublishedNews");

    res.status(200).json({
      news,
      success: true,
      message: `Lấy thành công ${news.length} bài viết mới`,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tin tức từ website khác:", error.message);
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy 8 tin thị trường mới nhất từ API TradeZone cho ticker trang chủ.
exports.getGlobalNews = CatchAsyncError(async (req, res, next) => {
  try {
    const { data: responseData } = await axios.get(
      "https://apitrade.zone9.network/api/news",
      { timeout: 10000 },
    );

    const sourceNews = Array.isArray(responseData?.data)
      ? responseData.data
      : [];

    const news = sourceNews
      .filter((item) => item && typeof item.content === "string")
      .sort(
        (first, second) =>
          new Date(second.created_at || 0) - new Date(first.created_at || 0),
      )
      .slice(0, 8)
      .map((item) => ({
        id: item._id,
        content: item.content.trim(),
        createdAt: item.created_at,
      }));

    return res.status(200).json({
      success: true,
      news,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lỗi khi lấy tin tức toàn cầu:", error.message);
    return next(
      new ErrorHandler("Không thể cập nhật tin tức thị trường.", 502),
    );
  }
});

// Lấy danh sách tin tức: không phân trang - Done
exports.getAllNewsNoPagination = CatchAsyncError(async (req, res, next) => {
  try {
    const isCacheExist = await redis.get("allNews");
    if (isCacheExist) {
      const news = JSON.parse(isCacheExist);
      return res.status(200).json({
        success: true,
        news,
      });
    } else {
      const news = await newsModel.find().sort({ createdAt: -1 });
      if (news.length === 0) {
        return res.status(200).json({
          success: true,
          news: [],
          message: "Không có tin tức nào",
        });
      }
      await redis.set("allNews", JSON.stringify(news));

      res.status(200).json({
        success: true,
        news,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy danh sách tin tức: không phân trang đã xuất bản - Done
exports.getAllPublishedNewsNoPagination = CatchAsyncError(
  async (req, res, next) => {
    try {
      const isCacheExist = await redis.get("allPublishedNews");
      if (isCacheExist) {
        const news = JSON.parse(isCacheExist);
        return res.status(200).json({
          success: true,
          news,
        });
      } else {
        const news = await newsModel
          .find({ status: true })
          .sort({ createdAt: -1 });
        if (news.length === 0) {
          return res.status(200).json({
            success: true,
            news: [],
            message: "Không có tin tức nào",
          });
        }
        await redis.set("allPublishedNews", JSON.stringify(news));

        res.status(200).json({
          success: true,
          news,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// Lấy chi tiết 1 tin tức theo slug (tăng lượt xem) - Done
exports.getSingleNews = CatchAsyncError(async (req, res, next) => {
  try {
    const isCacheExist = await redis.get(`news_${req.params.slug}`);
    if (isCacheExist) {
      const newsDetail = JSON.parse(isCacheExist);
      return res.status(200).json({
        success: true,
        newsDetail,
      });
    } else {
      const newSlug = req.params.slug;

      const newsDetail = await newsModel.findOneAndUpdate(
        { slug: newSlug },
        { $inc: { views: 1 } }, // tăng field "views" thêm 1 mỗi lần gọi
        { returnDocument: after }, // trả về document SAU khi đã update (mặc định trả về bản TRƯỚC khi update)
      );

      if (!newsDetail) {
        return next(new ErrorHandler("Không tồn tại tin tức này.", 404));
      }

      await redis.set(`news_${newSlug}`, JSON.stringify(newsDetail));

      res.status(200).json({
        success: true,
        newsDetail,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy chi tiết 1 tin tức theo slug (tăng lượt xem)
exports.getNewsBySlug = CatchAsyncError(async (req, res, next) => {
  try {
    const { slug } = req.params;

    const news = await newsModel.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!news) {
      return next(new ErrorHandler("Không tồn tại tin tức này.", 404));
    }

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy tin tức mới nhất
exports.getLatestNews = CatchAsyncError(async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const latestNews = await newsModel
      .find({ status: true })
      .sort({ createdAt: -1 })
      .limit(Math.max(parseInt(limit, 10) || 5, 1));

    res.status(200).json({
      success: true,
      latestNews,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy tin tức xem nhiều nhất
exports.getMostViewedNews = CatchAsyncError(async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const mostViewedNews = await newsModel
      .find({ status: true })
      .sort({ views: -1 })
      .limit(Math.max(parseInt(limit, 10) || 5, 1));

    res.status(200).json({
      success: true,
      mostViewedNews,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy danh sách các category hiện có
exports.getAllCategories = CatchAsyncError(async (req, res, next) => {
  try {
    const categories = await newsModel.distinct("category");

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Xoá tin tức
exports.deleteNews = CatchAsyncError(async (req, res, next) => {
  try {
    const newsId = req.params.id;

    const news = await newsModel.findByIdAndDelete(newsId);

    if (!news) {
      return next(new ErrorHandler("Không tồn tại tin tức này để xóa.", 404));
    }

    await Promise.all([
      await redis.del("allNews"),
      await redis.del("allPublishedNews"),
      await redis.del(`news_${newsId}`),
      await redis.del(`news_${news.slug}`),
    ]);

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Xóa hết - Done
exports.deleteAllNews = CatchAsyncError(async (req, res, next) => {
  try {
    await newsModel.deleteMany({});

    await redis.del("allNews");
    await redis.del("allPublishedNews");

    res.status(200).json({
      success: true,
      message: "Tất cả tin tức đã được xóa.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
