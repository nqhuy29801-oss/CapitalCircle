const express = require("express");
const { authorizeRoles, isAuthenticated } = require("../middleware/auth");
const {
  getAllArticlesNoPagination,
  getAllPublishedArticlesNoPagination,
  getMostViewedArticles,
  getLatestArticles,
  formatArticleContent,
  getSingleArticle,
  uploadArticle,
  editArticle,
  deleteArticle,
  deleteAllArticles,
} = require("../controllers/article.controller");

const route = express.Router();

route.get("/all-articles", isAuthenticated, getAllArticlesNoPagination);
route.get("/all-published-articles", getAllPublishedArticlesNoPagination);
route.get("/most-viewed-articles", getMostViewedArticles);
route.get("/latest-articles", getLatestArticles);

route.post(
  "/format-content",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  formatArticleContent,
);

route.get("/:slug", getSingleArticle);

route.post(
  "/update",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  uploadArticle,
);

route.put(
  "/edit/:id",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  editArticle,
);

route.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteArticle,
);

route.delete("/delete-all", deleteAllArticles);

module.exports = route;
