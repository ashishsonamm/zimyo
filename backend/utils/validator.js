const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

module.exports = (schema) => async (req, res, next) => {
  if (schema) {
    try {
      const options = {
        errors: {
          wrap: { label: "" },
        },
        abortEarly: true,
      };
      const body = req.method == "GET" ? req.query : req.body;
      await schema.validateAsync(body, options);
    } catch (error) {
      return requestHandler.sendError(res, error.message, 400)();
    }
  }
  next();
};
