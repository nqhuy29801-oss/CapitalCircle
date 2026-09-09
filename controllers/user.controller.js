const { CatchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../config/ErrorHandler");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const path = require("path");
const ejs = require("ejs");
const sendMail = require("../mails/sendMail");
const {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} = require("../config/jwt");
const { redis } = require("../config/redis");
const cloudinary = require("cloudinary");

function generateRandomString(length = 12) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Tập hợp tất cả các ký tự
  const allChars = lowercase + uppercase + numbers + symbols;

  // Đảm bảo chuỗi luôn chứa đủ ít nhất 1 ký tự của mỗi loại
  let result = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  // Lấp đầy các vị trí còn lại dựa theo độ dài (length) yêu cầu
  for (let i = result.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    result.push(allChars[randomIndex]);
  }

  // Trộn ngẫu nhiên thứ tự các ký tự (Shuffle)
  return result.sort(() => Math.random() - 0.5).join("");
}

// Registration user by guest - done
exports.registrationCourse = CatchAsyncError(async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber } = req.body;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = {
      fullName,
      email,
      phoneNumber,
      role: "guest",
    };

    const activationCode = createActivationCode(user);

    const data = { user: { name: user.fullName }, activationCode };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/htmlTemplate/activation-mail.ejs"),
      data,
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Mã trải nghiệm",
        template: "activation-mail.ejs",
        data,
      });

      const newGuest = await userModel.create({
        fullName,
        email,
        phoneNumber,
        role: "guest",
        status: "experience",
        activationCode,
      });

      await redis.del("guests");

      res.status(201).json({
        success: true,
        message: `Hãy kiểm tra email ${user.email} để nhập mã trải nghiệm.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Registration user by admin - done
exports.registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { fullName, email, password, gender, phoneNumber } = req.body;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email đã được đăng ký trước đó", 400));
    }

    if (!fullName || !email || !password) {
      return next(new ErrorHandler("Vui lòng điền đầy đủ thông tin", 400));
    }

    const user = {
      fullName,
      email,
      password,
      role: "deputy",
    };

    const activationToken = createActivationToken(user);

    const data = {
      user: { name: user.fullName, email: user.email, password: user.password },
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/htmlTemplate/accountInfor.ejs"),
      data,
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Thông tin tài khoản",
        template: "accountInfor.ejs",
        data,
      });

      const newUser = await userModel.create({
        fullName,
        email,
        password,
        phoneNumber,
        gender,
        role: "deputy",
      });

      await redis.del("users");

      res.status(201).json({
        success: true,
        user,
        token: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivationCode = (user) => {
  const activationCode = `Blue${Math.floor(1000 + Math.random() * 9000).toString()}`;

  return activationCode;
};

const createActivationToken = (user) => {
  const token = jwt.sign(
    {
      user,
    },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" },
  );

  return { token };
};

// Login user -check
exports.loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;

    if (!email || !password) {
      return next(new ErrorHandler("Vui lòng nhập email và mật khẩu", 400));
    }
    if (passwordSpecialCharacter.test(email)) {
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Email này chưa được đăng ký.", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(
          new ErrorHandler(
            "Mật khẩu không đúng! Vui lòng nhập lại mật khẩu.",
            400,
          ),
        );
      }

      sendToken(user, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Logout User
exports.logoutUser = CatchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    const userId = req.user?.id || "";
    await redis.del(userId);

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update access token
exports.updateAccessToken = CatchAsyncError(async (req, res, next) => {
  try {
    // For frontend
    const refresh_token = req.headers["refresh-token"];
    // For backend - đổi bên auth.js
    //const refresh_token = req.cookies.refresh_token;

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    const message = "Không thể refresh token";
    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }

    const session = await redis.get(decoded.id);

    if (!session) {
      return next(new ErrorHandler(message, 400));
    }

    const user = JSON.parse(session);

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "3d",
    });

    // For Backend
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    req.user = user;

    await redis.set(user._id, JSON.stringify(user), "EX", 604800);

    res.status(200).json({
      success: true,
      accessToken,
    });

    return next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get user info by id - done
exports.getUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    //const userId = req.user?._id || "";
    const userId = req.params.id;

    const userJSON = await redis.get(userId);

    if (userJSON) {
      const user = JSON.parse(userJSON);
      res.status(200).json({
        success: true,
        user,
      });
    }
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại.", 404));
    }

    await redis.set(userId, JSON.stringify(user), "EX", 1800);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all user info - done
exports.getAllUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const usersJSON = await redis.get("users");

    if (usersJSON) {
      const users = JSON.parse(usersJSON);
      return res.status(200).json({
        success: true,
        users,
      });
    }
    const users = await userModel.find({ role: "deputy" }).select("-password");

    await redis.set("users", JSON.stringify(users), "EX", 1800);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Done
exports.getAllGuestInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const guestsJSON = await redis.get("guests");

    if (guestsJSON) {
      const guests = JSON.parse(guestsJSON);
      return res.status(200).json({
        success: true,
        guests,
      });
    }
    const guests = await userModel.find({ role: "guest" }).select("-password");

    await redis.set("guests", JSON.stringify(guests), "EX", 1800);

    res.status(200).json({
      success: true,
      guests,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update user info - Done
exports.UpdateUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    // const userId = req.user?._id;
    const user = await userModel.findById(userId).select("-password");
    const isAdmin = await userModel.findById(req.user?._id).select("role");
    if (data.email !== user.email) {
      const isEmailExist = await userModel.findOne({ email: data.email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email này đã tồn tại.", 400));
      }
      user.email = data.email;
    }
    if (data.fullName !== user.fullName) {
      user.fullName = data.fullName;
    }
    if (data.phoneNumber !== user.phoneNumber) {
      user.phoneNumber = data.phoneNumber;
    }
    if (isAdmin === "admin" && data.role !== user.role) {
      user.role = data.role;
    }
    if (isAdmin === "admin" && data.status !== user.status) {
      user.status = data.status;
    }
    if (data.activationCode !== user.activationCode) {
      user.activationCode = data.activationCode;
    }

    await user.save();

    await redis.set(userId, JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update user password
exports.updatePassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Vui lòng điền đầy đủ thông tin.", 400));
    }

    const user = await userModel.findById(req.user?._id).select("+password");

    if (user?.password === undefined) {
      return next(new ErrorHandler("Tài khoản không tồn tại.", 400));
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Mật khẩu không đúng.", 400));
    }

    user.password = newPassword;

    await user.save();

    await redis.set(req.user?._id, JSON.stringify(user));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.resetPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return next(new ErrorHandler("Không tồn tại người dùng này !", 400));
    }

    const user = await userModel.findById(id).select("+password");

    if (user?.password === undefined) {
      return next(new ErrorHandler("Tài khoản không tồn tại.", 400));
    }

    const newPassword = generateRandomString(10);

    user.password = newPassword;

    const data = {
      user: { name: user.fullName, email: user.email, password: user.password },
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/htmlTemplate/resetPassword.ejs"),
      data,
    );

    await sendMail({
      email: user.email,
      subject: "Thông báo đặt lại mật khẩu tài khoản",
      template: "resetPassword.ejs",
      data,
    });

    await user.save();

    await redis.set(req.user?._id, JSON.stringify(user));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update profile picture
exports.updateProfilePicture = CatchAsyncError(async (req, res, next) => {
  try {
    const { avatar } = req.body;
    console.log(req.body);

    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatar",
          width: 150,
        });

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatar",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }

    await user?.save();

    await redis.set(userId, JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Delete user - done
exports.deleteSingleUser = CatchAsyncError(async (req, res, next) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.params.id });

    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại để xóa.", 400));
    }
    if (user.role === "guest") {
      await redis.del("guests");
      await redis.del(req.params.id);
    } else {
      await redis.del("users");
      await redis.del(req.params.id);
    }

    await redis.del();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
