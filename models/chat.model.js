const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = require("./user.model");
const ErrorHandler = require("../config/ErrorHandler");

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [],
      required: true,
    },
    user: {
      type: {
        _id: Schema.Types.ObjectId,
      },
      required: true,
    },
    messages: {
      type: [
        {
          senderId: String,
          receiverId: String,
          message: String,
        },
      ],
    },
  },
  { timestamps: true },
);

chatSchema.pre("save", async function (next) {
  const user = await userModel.findById(this.user).select("-password");
  if (!user) {
    return next(new ErrorHandler("Không tồn tại người dùng này", 401));
  }
  this.user = user;

  next();
});

const chatMessagesModel = mongoose.model("ChatMessages", chatSchema);

module.exports = chatMessagesModel;
