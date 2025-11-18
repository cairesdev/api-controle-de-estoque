const { INTERNAL_SERVER_ERROR } = require("../lib/http-status");
const { DefaultMessages } = require("../lib/returns");

const InterceptError = async (callback, req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    console.error("Interceptador: ", error);
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: DefaultMessages.server_error,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = InterceptError;
