const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề banner"],
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Vui lòng cung cấp link hình ảnh banner"],
    },
    buttonText: {
      type: String,
      default: "Đọc bài mới nhất",
      trim: true,
    },
    buttonLink: {
      type: String,
      default: "#",
      trim: true,
    },
    scriptText: {
      type: String,
      default: "Good\nInvesting\nBrighter\nLife",
      trim: true,
    },
    scriptColor: {
      type: String,
      default: "text-slate-200/90",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
