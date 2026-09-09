const ErrorHandler = require("../config/ErrorHandler");
const { CatchAsyncError } = require("../middleware/catchAsyncError");
const chatMessagesModel = require("../models/chat.model");
const { redis } = require("../config/redis");
const { getReceiverSocketId, io } = require("../config/socket");

exports.sendMessages = CatchAsyncError(async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let conversations = await chatMessagesModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversations) {
      if (req.user?.role === "user") {
        conversations = await chatMessagesModel.create({
          participants: [senderId, receiverId],
          user: senderId,
          doctor: receiverId,
        });
      } else {
        conversations = await chatMessagesModel.create({
          participants: [senderId, receiverId],
          user: receiverId,
          doctor: senderId,
        });
      }
    }

    const newMessage = {
      senderId,
      receiverId,
      message,
    };

    if (newMessage) {
      conversations.messages.push(newMessage);
    }

    await Promise.all([conversations.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

exports.getMessages = CatchAsyncError(async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;

    const conversations = await chatMessagesModel
      .findOne({
        participants: { $all: [senderId, userToChatId] },
      })
      .populate("messages");

    if (!conversations)
      return next(new ErrorHandler("Không có cuộc trò chuyện nào.", 401));

    const messages = conversations.messages;

    await redis.set(
      `conversations_${conversations._id}`,
      JSON.stringify(messages),
    );

    res.status(201).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

exports.getConversations = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const conversations = await chatMessagesModel.find({
      participants: [userId],
    });

    if (!conversations)
      return next(new ErrorHandler("Không có cuộc trò chuyện nào. ", 401));

    let userToChats = [];

    if (req.user?.role === "user") {
      conversations.forEach((e) => {
        userToChats.push(e.doctor);
      });
    } else {
      conversations.forEach((e) => {
        userToChats.push(e.user);
      });
    }
    console.log(userToChats);

    res.status(201).json({
      success: true,
      userToChats,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});
