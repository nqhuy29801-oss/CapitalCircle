const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
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

    image: {
      type: String,
      unique: true,
    },

    heading: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "",
    },

    subheading: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Kiến thức chung",
    },

    author: {
      type: String,
      default: "",
    },

    viewed: {
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

const articleModel = mongoose.model("Article", articleSchema);

module.exports = articleModel;
