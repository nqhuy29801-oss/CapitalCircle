const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://10.0.2.2:8081'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  console.log(userSocketMap[receiverId]);
  return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
  console.log('user connected', [socket.request.headers, socket.id]);

  const userId = socket.handshake.query.userId;
  if (userId === undefined) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUser', Object.keys(userSocketMap));

  socket.on('message', (data) => {
    const { message, targetId, sourceId } = data;
    const receiverSocketId = getReceiverSocketId(targetId);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', [socket.id]);
  });
});

module.exports = { app, io, server, getReceiverSocketId };
