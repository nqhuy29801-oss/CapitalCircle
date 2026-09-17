const express = require("express");
const { askAI } = require("../controllers/tools.controller");

const route = express.Router();

route.post("/ask-ai", askAI);

module.exports = route;
