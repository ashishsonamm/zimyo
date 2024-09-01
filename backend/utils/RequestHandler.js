class RequestHandler {
    constructor() {}
  
    sendSuccess(res, message, status) {
      return (data, globalData) => {
        res.status(status).json({
          success: true,
          message: message || "Success result",
          data,
          ...globalData,
        });
      };
    }
  
    sendError(res, message, status) {
      return (data, globalData) => {
        res.status(status).json({
          success: false,
          message: message || "Error result",
          data,
          ...globalData,
        });
      };
    }
  
    sendUnhandledError(req, res, error) {
      return res.status(error.status || 500).json({
        success: "error",
        message: error.message || "Unhandled Error",
        error,
      });
    }
  }
  
  module.exports = RequestHandler;
  