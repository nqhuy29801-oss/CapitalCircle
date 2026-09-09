const express = require("express");
const { authorizeRoles, isAuthenticated } = require("../middleware/auth");
const {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} = require("../controllers/banner.controller");

const router = express.Router();

// Public: Get active banners for Homepage Slideshow
router.get("/active", getActiveBanners);

// Admin / Deputy: Get all banners
router.get(
  "/all",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  getAllBanners
);

// Admin / Deputy: Create new banner
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  createBanner
);

// Admin / Deputy: Update banner
router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  updateBanner
);

// Admin / Deputy: Toggle banner active state
router.patch(
  "/toggle/:id",
  isAuthenticated,
  authorizeRoles("admin", "deputy"),
  toggleBannerStatus
);

// Admin: Delete banner
router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBanner
);

module.exports = router;
