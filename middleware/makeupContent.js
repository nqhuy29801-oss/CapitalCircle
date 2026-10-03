const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenAI } = require("@google/genai");
const { redis } = require("../config/redis");
const { convert } = require("html-to-text");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-3.6-flash";
const MAX_RETRIES = 3;
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 ngày
const CACHE_PREFIX = "article-makeup-cache:";

// Các thẻ rác nên xoá bằng cheerio TRƯỚC khi gửi cho Gemini (rẻ hơn nhờ AI đoán)
const JUNK_SELECTORS = [
  "script",
  "style",
  "iframe",
  "ins",
  "img",
  "table",
  "noscript",
  "[class*='ads']",
  "[id*='ads']",
  ".pTitle",
  ".pAuthor",
  ".pSource",
  ".pPublishTimeSource",
];

// ===== Cache theo URL =====

const buildCacheKey = (url) => `${CACHE_PREFIX}${url}`;

async function getCachedArticle(url) {
  try {
    const cached = await redis.get(buildCacheKey(url));
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn(`[cache] Không đọc được cache cho ${url}:`, error.message);
    return null;
  }
}

async function setCachedArticle(url, article) {
  try {
    await redis.set(
      buildCacheKey(url),
      JSON.stringify(article),
      "EX",
      CACHE_TTL_SECONDS,
    );
  } catch (error) {
    console.warn(`[cache] Không lưu được cache cho ${url}:`, error.message);
  }
}

// ===== Tiền xử lý HTML bằng cheerio =====

function preCleanHtml($, detailEl) {
  const clone = detailEl.clone();
  JUNK_SELECTORS.forEach((sel) => clone.find(sel).remove());
  clone.find("*").each((_, el) => {
    $(el).removeAttr("style class onclick id");
  });
  return clone.html() || "";
}

// ===== Gọi Gemini với retry =====

async function callGeminiWithRetry(prompt, maxRetries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response?.text?.trim();
      if (!text)
        throw new Error(
          "Gemini trả về nội dung rỗng (có thể bị safety filter chặn)",
        );
      return text;
    } catch (error) {
      const message = error?.message || "";
      const isRateLimited =
        message.includes("429") || message.includes("RESOURCE_EXHAUSTED");

      if (isRateLimited && attempt < maxRetries) {
        const retryMatch = message.match(/retry in ([\d.]+)s/i);
        const waitMs = retryMatch
          ? parseFloat(retryMatch[1]) * 1000
          : (attempt + 1) * 3000;
        console.warn(
          `[Gemini] Rate limited, thử lại lần ${attempt + 1}/${maxRetries} sau ${Math.round(waitMs)}ms`,
        );
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw error;
    }
  }
}

async function makeupContentWithGemini(rawHtml) {
  if (!rawHtml || !rawHtml.trim()) return "";

  const prompt = `
    Bạn là một chuyên gia biên tập tin tức và thiết kế UI/UX báo chí.
    Hãy cấu trúc lại đoạn mã HTML tin tức đã được lọc sơ bộ dưới đây:

    \`\`\`html
    ${rawHtml}
    \`\`\`

    YÊU CẦU CHUYỂN ĐỔI:
    1. Chuyển đổi các lớp (class) bài viết cũ thành mã HTML chuẩn dùng Tailwind CSS:
       - Thẻ Sapo (.pHead): <p class="mb-6 text-slate-900 text-lg sm:text-xl font-semibold leading-relaxed border-l-4 border-indigo-600 pl-4 py-1 bg-slate-50 rounded-r-lg">
       - Thẻ Tiêu đề phụ (.pSubTitle): <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">
       - Thẻ Đoạn văn (.pBody): <p class="mb-5 text-slate-900 text-base sm:text-lg leading-relaxed text-justify sm:text-left font-normal">
       - Trích dẫn (nếu có): <blockquote class="my-6 pl-5 py-3 border-l-4 border-amber-500 italic text-slate-800 bg-amber-50/60 rounded-r-xl">
    2. CHỈ TRẢ VỀ DUY NHẤT ĐOẠN MÃ HTML ĐÃ ĐƯỢC MAKE UP. Không kèm lời giải thích hay markdown rác.
  `;

  try {
    const raw = await callGeminiWithRetry(prompt);
    return raw
      .replace(/^```html\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  } catch (error) {
    console.error(
      "Lỗi khi make up HTML bằng Gemini (đã hết retry):",
      error.message,
    );
    return rawHtml; // fallback giữ nguyên luồng cào tin
  }
}

async function fetchArticleContent(url, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = await getCachedArticle(url);
    if (cached) {
      console.log(`[cache] Hit: ${url}`);
      return cached;
    }
  }

  try {
    const { data: html } = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(html);
    const detailEl = $("#vst_detail");

    if (detailEl.length === 0) {
      throw new Error(`Không tìm thấy #vst_detail tại URL: ${url}`);
    }

    const sourceText = detailEl.find(".pSource > a").attr("href") || "";
    const dateText = detailEl
      .find(".pPublishTimeSource")
      .text()
      .replace("-", "")
      .trim();
    const authorText = detailEl.find(".pAuthor").text().trim();

    const preCleanedHtml = preCleanHtml($, detailEl);
    //const beautifulContent = await makeupContentWithGemini(preCleanedHtml);

    const article = {
      postSource: sourceText,
      postDate: dateText,
      postContent: preCleanedHtml,
      postAuthor: authorText,
    };

    await setCachedArticle(url, article);
    return article;
  } catch (error) {
    console.error(`Lỗi khi fetch bài viết từ ${url}:`, error.message);
    throw error;
  }
}

module.exports = { fetchArticleContent, makeupContentWithGemini };
