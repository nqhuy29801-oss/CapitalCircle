const express = require("express");
const uploadWord = require("../middleware/uploadWord");
const { uploadWordArticle } = require("../controllers/wordArticle.controller");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const route = express.Router();

route.post(
  "/upload-word",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  uploadWord,
  uploadWordArticle,
);

module.exports = route;
