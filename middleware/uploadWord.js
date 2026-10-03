const multer = require("multer");

// Lưu buffer trong RAM thay vì ghi ra đĩa — vì ta chỉ cần đọc qua mammoth
// rồi bỏ, không cần giữ lại file .docx gốc trên server.
const storage = multer.memoryStorage();

const WORD_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — đủ cho file Word có vài chục ảnh
  fileFilter: (req, file, cb) => {
    if (!WORD_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error(
          "Chỉ chấp nhận file Word định dạng .docx (Word 2007 trở lên).",
        ),
        false,
      );
    }
    cb(null, true);
  },
});

// Field name form-data phải là "wordFile" khi gọi từ frontend/Postman
module.exports = upload.single("wordFile");
