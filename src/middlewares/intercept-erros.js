const { httpStatus } = require("../lib");
const { INTERNAL_SERVER_ERROR } = require("../lib/http-status");
const { DefaultMessages } = require("../lib/returns");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "123456";

const InterceptError = async (callback, req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Token não informado.",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Token expirado. Faça login novamente.",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Token inválido.",
        });
      }

      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Falha na autenticação.",
      });
    }

    req.user = decoded;

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
