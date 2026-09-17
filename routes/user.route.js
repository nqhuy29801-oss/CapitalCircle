const express = require("express");
const {
  deleteSingleUser,
  getUserInfo,
  getAllUserInfo,
  getAllGuestInfo,
  loginUser,
  logoutUser,
  registrationUser,
  registrationPublic,
  registrationCourse,
  updateAccessToken,
  updatePassword,
  resetPassword,
  UpdateUserInfo,
} = require("../controllers/user.controller");
const { authorizeRoles, isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/registration-course", registrationCourse);
router.post("/registration-public", registrationPublic);

router.post(
  "/registration-user",
  isAuthenticated,
  authorizeRoles("admin"),
  registrationUser,
);

router.post("/login-user", loginUser);

router.get("/logout", isAuthenticated, logoutUser);

router.get("/refresh-token", updateAccessToken);

router.get("/info/:id", isAuthenticated, getUserInfo);

router.get("/all-guests", isAuthenticated, getAllGuestInfo);
//router.get("/all-users", getAllUserInfo);
router.get(
  "/all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUserInfo,
);

router.put("/update-user-info", isAuthenticated, UpdateUserInfo);
//router.put("/update-user-info/:id", UpdateUserInfo);

router.put("/update-password", isAuthenticated, updatePassword);

router.put("/reset-password", isAuthenticated, resetPassword);

//router.put("/update-user-picture", isAuthenticated, updateProfilePicture);

router.delete(
  "/delete-single-user",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteSingleUser,
);
//router.delete("/delete-single-user/:id", deleteSingleUser);

module.exports = router;
