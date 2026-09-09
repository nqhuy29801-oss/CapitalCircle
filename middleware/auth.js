const { CatchAsyncError } = require("./catchAsyncError");
const ErrorHandler = require("../config/ErrorHandler");
const jwt = require("jsonwebtoken");
const { redis } = require("../config/redis");
const { updateAccessToken } = require("../controllers/user.controller");

// Authenticated user
exports.isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.headers["access-token"];
  if (!access_token) {
    return next(
      new ErrorHandler("Hãy đăng nhập để có thể truy cập dữ liệu.", 400),
    );
  }
  const decoded = jwt.decode(access_token);

  if (!decoded) {
    return next(new ErrorHandler("Không tìm thấy access token.", 400));
  }

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("Không tìm thấy người dùng.", 400));
    }
    req.user = JSON.parse(user);

    next();
  }
});

// Validate user role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} không đủ quyền truy cập.`,
          403,
        ),
      );
    }
    next();
  };
};
