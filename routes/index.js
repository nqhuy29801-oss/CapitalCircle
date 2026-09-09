const userRoute = require("./user.route");
const newsRoute = require("./news.route");
const chatMessagesRoute = require("./chatMessages.route");
const bannerRoute = require("./banner.route");

const headerAPI = "/api/v1";

module.exports = function route(app) {
  app.use(`${headerAPI}/user`, userRoute);
  app.use(`${headerAPI}/news`, newsRoute);
  app.use(`${headerAPI}/chatMessages`, chatMessagesRoute);
  app.use(`${headerAPI}/banner`, bannerRoute);
};

