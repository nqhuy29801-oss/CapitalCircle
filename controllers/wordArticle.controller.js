const mammoth = require("mammoth");
const cloudinary = require("cloudinary").v2;
const { GoogleGenAI } = require("@google/genai");
const ErrorHandler = require("../config/ErrorHandler");
const { CatchAsyncError } = require("../middleware/catchAsyncError");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-3.2-flash";
const MAX_RETRIES = 3;

// ===== 1. Tách tên file -> dùng làm tiêu đề gợi ý =====

/** "bai-viet_ve-vang-2026.docx" -> "bai viet ve vang 2026" */
function extractTitleFromFilename(originalname) {
  return originalname
    .replace(/\.(docx|doc)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ===== 2. Đọc nội dung Word bằng mammoth, upload ảnh nhúng lên Cloudinary =====

/** mammoth gọi hàm này cho mỗi ảnh nhúng trong file .docx */
async function uploadDocxImageToCloudinary(image) {
  const base64 = await image.read("base64");
  const dataUri = `data:${image.contentType};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "articles/word-import",
    resource_type: "image",
  });

  // mammoth sẽ dùng giá trị "src" này để render thẻ <img src="...">
  return { src: result.secure_url };
}

/** Chuyển buffer .docx -> HTML thô, ảnh nhúng đã được thay bằng URL Cloudinary */
async function convertDocxToHtml(buffer) {
  const { value: html, messages } = await mammoth.convertToHtml(
    { buffer },
    { convertImage: mammoth.images.imgElement(uploadDocxImageToCloudinary) },
  );

  const warnings = messages.filter((m) => m.type === "warning");
  if (warnings.length) {
    console.warn(
      "[mammoth] Cảnh báo khi đọc file Word:",
      warnings.map((w) => w.message),
    );
  }

  return html;
}

// ===== 3. Gọi Gemini với retry (giống pipeline cào tin) =====

async function callGeminiWithRetry(prompt, maxRetries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response?.text?.trim();
      if (!text) {
        throw new Error(
          "Gemini trả về nội dung rỗng (có thể bị safety filter chặn)",
        );
      }
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

// ===== 4. Make up HTML Word thành HTML Tailwind =====

async function makeupWordContentWithGemini(rawHtml) {
  if (!rawHtml || !rawHtml.trim()) return "";

  const prompt = `
    Bạn là chuyên gia biên tập & thiết kế UI/UX báo chí.
    Dưới đây là nội dung HTML được trích xuất từ 1 file Word (.docx) do người dùng tải lên:

    \`\`\`html
    ${rawHtml}
    \`\`\`

    YÊU CẦU:
    1. GIỮ NGUYÊN toàn bộ nội dung chữ, thứ tự đoạn văn, danh sách, bảng biểu và các thẻ
       <img> (giữ nguyên thuộc tính src, KHÔNG được xoá hay thay ảnh).
    2. Cấu trúc lại bằng HTML chuẩn + gắn class Tailwind CSS:
       - <h1>: class="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-4"
       - <h2>: class="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2"
       - <h3>: class="text-lg font-semibold text-slate-900 mt-6 mb-3"
       - <p>: class="mb-5 text-slate-900 text-base sm:text-lg leading-relaxed"
       - <ul>: class="list-disc pl-6 mb-5 space-y-1 text-slate-900"
       - <ol>: class="list-decimal pl-6 mb-5 space-y-1 text-slate-900"
       - <blockquote>: class="my-6 pl-5 py-3 border-l-4 border-amber-500 italic text-slate-800 bg-amber-50/60 rounded-r-xl"
       - <img>: bọc trong <figure class="my-6 text-center"><img class="rounded-xl shadow-md mx-auto max-w-full h-auto" .../></figure>
       - <table>: class="w-full border-collapse my-6 text-sm"; <th>/<td>: class="border border-slate-200 px-3 py-2"
    3. KHÔNG được rút gọn, diễn giải lại, dịch, hay bỏ bớt bất kỳ nội dung chữ nào của bản gốc.
    4. CHỈ TRẢ VỀ DUY NHẤT ĐOẠN MÃ HTML ĐÃ MAKE UP. Không kèm lời giải thích hay markdown rác.
  `;

  try {
    const raw = await callGeminiWithRetry(prompt);
    return raw
      .replace(/^```html\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  } catch (error) {
    console.error(
      "Lỗi khi make up nội dung Word bằng Gemini (đã hết retry):",
      error.message,
    );
    return rawHtml; // fallback: vẫn còn HTML gốc (chưa đẹp) thay vì mất trắng nội dung
  }
}

// ===== 5. Controller — nhận file từ multer (req.file), trả về title + content =====

exports.uploadWordArticle = CatchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("Vui lòng tải lên 1 file Word (.docx).", 400));
  }

  try {
    const title = extractTitleFromFilename(req.file.originalname);
    const rawHtml = await convertDocxToHtml(req.file.buffer);

    if (!rawHtml.trim()) {
      return next(
        new ErrorHandler("File Word không có nội dung để xử lý.", 400),
      );
    }

    const content = await makeupWordContentWithGemini(rawHtml);

    // Trả về title/content để phía admin xem trước & chỉnh sửa trước khi
    // gọi API tạo bài viết (uploadNews/uploadArticle) — tránh lưu thẳng vào
    // DB ngay tại bước upload, phòng khi cần sửa tiêu đề hoặc nội dung make up.
    return res.status(200).json({
      success: true,
      title,
      content,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý file Word:", error.message);
    return next(new ErrorHandler("Không thể xử lý file Word này.", 500));
  }
});
