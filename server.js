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

// Rest API
route(app);

// Error middleware must be registered after all routes so route errors return JSON.
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
