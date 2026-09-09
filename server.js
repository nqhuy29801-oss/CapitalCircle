const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const route = require("./routes");
const { ErrorMiddleware } = require("./middleware/error");
require("dotenv").config();
const { app, server } = require("./config/socket");
const path = require("path");

app.use(express.static(path.join(__dirname, "frontend")));

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

app.use(cors());

// Middleware
app.use(ErrorMiddleware);

// Rest API
route(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
