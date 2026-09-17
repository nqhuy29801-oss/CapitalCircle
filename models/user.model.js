const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your full name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      //required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 character"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["admin", "deputy", "guest"],
    },
    gender: {
      type: String,
      default: "other",
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    address: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    activationCode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "experience", "joined"],
      default: "active",
    },
  },
  { timestamps: true },
);

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Sign access token
// userSchema.methods.SignAccessToken = function () {
//   return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
//     expiresIn: "5m",
//   });
// };

// // Sign refresh token
// userSchema.methods.SignRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
//     expiresIn: "3d",
//   });
// };

// // Compare password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   if (enteredPassword === undefined) return false;
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Hash password before saving — dùng style async không cần next(), tránh lỗi gọi next() nhiều lần
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
