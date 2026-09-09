const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    url: {
      type: String,
      unique: true,
      sparse: true,
    },

    postHeading: {
      type: String,
      default: "",
    },

    postContent: {
      type: String,
      default: "",
    },

    postImage: String,

    postDate: {
      type: String,
      default: "",
    },

    postSource: {
      type: String,
      default: "",
    },

    postSubheading: String,

    category: {
      type: String,
      default: "Tài sản số",
    },

    postAuthor: {
      type: String,
      default: "",
    },

    views: {
      type: Number,
      default: 0,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const newsModel = mongoose.model("News", newsSchema);

module.exports = newsModel;
