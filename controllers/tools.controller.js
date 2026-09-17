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
              text: "Bạn là tradeFlow AI của Capital Circle. Hãy trả lời bằng tiếng Việt, rõ ràng, thực tế và ngắn gọn. Cung cấp thông tin giáo dục, không khẳng định lợi nhuận và luôn nhắc người dùng tự đánh giá rủi ro khi câu hỏi liên quan đến quyết định đầu tư cụ thể.",
            },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 800,
        },
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      },
    );

    const answer = response.data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!answer) {
      return next(
        new ErrorHandler("Gemini không trả về nội dung trả lời.", 502),
      );
    }

    return res.status(200).json({
      success: true,
      answer,
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
