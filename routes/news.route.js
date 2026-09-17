const express = require("express");
const { authorizeRoles, isAuthenticated } = require("../middleware/auth");
const {
  getNewsFromOtherWebsite,
  getAllNewsNoPagination,
  getAllPublishedNewsNoPagination,
  getSingleNews,
  uploadNews,
  editNews,
  deleteNews,
  deleteAllNews,
  getGlobalNews,
} = require("../controllers/news.controller");

const route = express.Router();

route.get("/other-website-news", getNewsFromOtherWebsite);
route.get("/global-news", getGlobalNews);

route.get("/all-news", isAuthenticated, getAllNewsNoPagination);
route.get("/all-published-news", getAllPublishedNewsNoPagination);

route.get("/:slug", getSingleNews);

route.post(
  "/update-news",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  uploadNews,
);

route.put(
  "/edit-news/:id",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  editNews,
);

route.delete(
  "/delete-news/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteNews,
);

route.delete("/delete-all-news", deleteAllNews);

module.exports = route;
