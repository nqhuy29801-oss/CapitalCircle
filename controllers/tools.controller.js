const axios = require("axios");
const ErrorHandler = require("../config/ErrorHandler");
const { CatchAsyncError } = require("../middleware/catchAsyncError");

const GEMINI_MODEL = "gemini-3.6-flash";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 12;

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_ITEMS)
    .filter(
      (item) =>
        item &&
        ["user", "model"].includes(item.role) &&
        typeof item.text === "string" &&
        item.text.trim(),
    )
    .map((item) => ({
      role: item.role,
      parts: [{ text: item.text.trim().slice(0, MAX_MESSAGE_LENGTH) }],
    }));
};

exports.askAI = CatchAsyncError(async (req, res, next) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!apiKey) {
    return next(
      new ErrorHandler("GEMINI_API_KEY chưa được cấu hình trên server.", 500),
    );
  }

  if (!message) {
    return next(new ErrorHandler("Vui lòng nhập câu hỏi.", 400));
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return next(
      new ErrorHandler(
        `Câu hỏi không được vượt quá ${MAX_MESSAGE_LENGTH} ký tự.`,
        400,
      ),
    );
  }

  const contents = [
    ...normalizeHistory(req.body?.history),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        systemInstruction: {
          parts: [
            {
              text: "Bạn là C.C AI của Capital Circle. Hãy trả lời bằng tiếng Việt, rõ ràng, thực tế và ngắn gọn. Cung cấp thông tin giáo dục, không khẳng định lợi nhuận và luôn nhắc người dùng tự đánh giá rủi ro khi câu hỏi liên quan đến quyết định đầu tư cụ thể.",
            },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
        },
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      },
    );

    const candidate = response.data?.candidates?.[0];
    const finishReason = candidate?.finishReason;

    const answer = candidate?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!answer) {
      const reasonMessage =
        finishReason === "SAFETY" || finishReason === "RECITATION"
          ? "Câu hỏi hoặc nội dung trả lời vi phạm chính sách an toàn của Gemini."
          : "Gemini không trả về nội dung trả lời.";
      console.error("Gemini finishReason:", finishReason);
      return next(new ErrorHandler(reasonMessage, 502));
    }

    if (finishReason === "MAX_TOKENS") {
      // Vẫn trả câu trả lời (dù cụt) nhưng cảnh báo rõ để debug / hiển thị cho user biết
      console.warn("Gemini answer bị cắt do chạm maxOutputTokens.");
    }

    return res.status(200).json({
      success: true,
      answer,
      truncated: finishReason === "MAX_TOKENS", // frontend có thể hiện "..." hoặc nút "Xem thêm"
    });
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message;
    console.error("Gemini API error:", providerMessage || error.message);
    return next(
      new ErrorHandler(
        providerMessage || "Không thể kết nối với trợ lý AI lúc này.",
        error.response?.status === 429 ? 429 : 502,
      ),
    );
  }
});
