const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  getConversations,
  getMessages,
  sendMessages,
} = require('../controllers/chatMessages.controller');

const route = express.Router();

route.post('/send-message/:id', isAuthenticated, sendMessages);

route.get('/get-messages/:id', isAuthenticated, getMessages);

route.get('get-conversations', isAuthenticated, getConversations);

module.exports = route;
