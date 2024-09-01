const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    requestHandler.sendError(
      res,
      err?.message || "Something went wrong.",
      500
    )();
  });
};
