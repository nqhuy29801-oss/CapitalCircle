const Banner = require("../models/banner.model");
const ErrorHandler = require("../config/ErrorHandler");
const { CatchAsyncError } = require("../middleware/catchAsyncError");
const { redis } = require("../config/redis");

const DEFAULT_SLIDES = [
  {
    title: "Đầu tư tốt hơn\nmỗi ngày",
    subtitle: "“Hành trình vững vàng tài chính bắt đầu từ việc hiểu đúng và kiên trì học hỏi.”",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
    buttonText: "Đọc bài mới nhất",
    buttonLink: "./article.html?slug=ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan",
    scriptText: "Good\nInvesting\nBrighter\nLife",
    scriptColor: "text-slate-200/90",
    order: 1,
    isActive: true,
  },
  {
    title: "Kỷ luật &\nGiá trị dài hạn",
    subtitle: "“Thành công bền vững không đến từ việc đoán thị trường, mà đến từ sự kiên định với hệ thống nguyên tắc.”",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
    buttonText: "Khám phá bài học kỷ luật",
    buttonLink: "./article.html?slug=ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan",
    scriptText: "Stay\nPatient\nBuild\nWealth",
    scriptColor: "text-amber-300/90",
    order: 2,
    isActive: true,
  },
  {
    title: "Tư duy độc lập\ngiữa thị trường",
    subtitle: "“Hãy sợ hãi khi người khác tham lam, và luôn giữ cái đầu lạnh khi đám đông phấn khích tột độ.”",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=85",
    buttonText: "10 nguyên tắc Warren Buffett",
    buttonLink: "./article.html?slug=10-nguyen-tac-dau-tu-cua-warren-buffett",
    scriptText: "Think\nDeep\nInvest\nSmart",
    scriptColor: "text-sky-300/90",
    order: 3,
    isActive: true,
  },
  {
    title: "Quản trị rủi ro\ntrước lợi nhuận",
    subtitle: "“Quy tắc số 1 là không bao giờ để mất vốn. Bảo toàn năng lực đầu tư chính là gốc rễ của lãi kép.”",
    imageUrl: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=85",
    buttonText: "Bài học quản trị rủi ro",
    buttonLink: "./article.html?slug=quan-tri-rui-ro-bai-hoc-khong-bao-gio-cu",
    scriptText: "Protect\nCapital\nCompound\nForever",
    scriptColor: "text-emerald-300/90",
    order: 4,
    isActive: true,
  },
];

// Invalidate Redis cache
async function invalidateBannerCache() {
  try {
    await redis.del("activeBanners");
  } catch (err) {
    console.warn("Redis delete activeBanners error:", err.message);
  }
}

// 1. Get active banners for Homepage (Public)
exports.getActiveBanners = CatchAsyncError(async (req, res, next) => {
  try {
    const cached = await redis.get("activeBanners");
    if (cached) {
      return res.status(200).json({
        success: true,
        banners: JSON.parse(cached),
      });
    }
  } catch (err) {
    console.warn("Redis get activeBanners error:", err.message);
  }

  let banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

  // Auto-seed if database has 0 banners
  if (!banners || banners.length === 0) {
    for (const slide of DEFAULT_SLIDES) {
      await Banner.create(slide);
    }
    banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  }

  try {
    await redis.set("activeBanners", JSON.stringify(banners), "EX", 3600);
  } catch (err) {
    console.warn("Redis set activeBanners error:", err.message);
  }

  res.status(200).json({
    success: true,
    banners,
  });
});

// 2. Get all banners (Admin)
exports.getAllBanners = CatchAsyncError(async (req, res, next) => {
  let banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });

  // If empty, seed default slides
  if (!banners || banners.length === 0) {
    for (const slide of DEFAULT_SLIDES) {
      await Banner.create(slide);
    }
    banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    banners,
  });
});

// 3. Create new banner (Admin / Deputy)
exports.createBanner = CatchAsyncError(async (req, res, next) => {
  const {
    title,
    subtitle,
    imageUrl,
    buttonText,
    buttonLink,
    scriptText,
    scriptColor,
    order,
    isActive,
  } = req.body;

  if (!title || !imageUrl) {
    return next(new ErrorHandler("Vui lòng nhập đầy đủ tiêu đề và hình ảnh cho banner", 400));
  }

  const newBanner = await Banner.create({
    title,
    subtitle: subtitle || "",
    imageUrl,
    buttonText: buttonText || "Đọc bài mới nhất",
    buttonLink: buttonLink || "#",
    scriptText: scriptText || "Good\nInvesting\nBrighter\nLife",
    scriptColor: scriptColor || "text-slate-200/90",
    order: Number(order) || 0,
    isActive: typeof isActive === "boolean" ? isActive : true,
    createdBy: req.user?.userName || "Admin",
  });

  await invalidateBannerCache();

  res.status(201).json({
    success: true,
    message: "Thêm banner slideshow mới thành công!",
    banner: newBanner,
  });
});

// 4. Update banner (Admin / Deputy)
exports.updateBanner = CatchAsyncError(async (req, res, next) => {
  const id = req.params.id || req.body._id || req.body.id;
  if (!id) {
    return next(new ErrorHandler("Không tìm thấy mã banner cần cập nhật", 400));
  }

  const banner = await Banner.findById(id);
  if (!banner) {
    return next(new ErrorHandler("Banner không tồn tại", 404));
  }

  const {
    title,
    subtitle,
    imageUrl,
    buttonText,
    buttonLink,
    scriptText,
    scriptColor,
    order,
    isActive,
  } = req.body;

  if (title !== undefined) banner.title = title;
  if (subtitle !== undefined) banner.subtitle = subtitle;
  if (imageUrl !== undefined && imageUrl) banner.imageUrl = imageUrl;
  if (buttonText !== undefined) banner.buttonText = buttonText;
  if (buttonLink !== undefined) banner.buttonLink = buttonLink;
  if (scriptText !== undefined) banner.scriptText = scriptText;
  if (scriptColor !== undefined) banner.scriptColor = scriptColor;
  if (order !== undefined) banner.order = Number(order);
  if (isActive !== undefined) banner.isActive = Boolean(isActive);

  await banner.save();
  await invalidateBannerCache();

  res.status(200).json({
    success: true,
    message: "Cập nhật banner thành công!",
    banner,
  });
});

// 5. Delete banner (Admin only)
exports.deleteBanner = CatchAsyncError(async (req, res, next) => {
  const id = req.params.id || req.body.id;
  if (!id) {
    return next(new ErrorHandler("Không tìm thấy mã banner cần xoá", 400));
  }

  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) {
    return next(new ErrorHandler("Banner không tồn tại", 404));
  }

  await invalidateBannerCache();

  res.status(200).json({
    success: true,
    message: "Xoá banner thành công!",
  });
});

// 6. Toggle banner active status (Admin / Deputy)
exports.toggleBannerStatus = CatchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const banner = await Banner.findById(id);
  if (!banner) {
    return next(new ErrorHandler("Banner không tồn tại", 404));
  }

  banner.isActive = !banner.isActive;
  await banner.save();
  await invalidateBannerCache();

  res.status(200).json({
    success: true,
    message: banner.isActive ? "Đã bật hiển thị banner!" : "Đã ẩn banner!",
    banner,
  });
});
