const ResponseController = (response, httpStatus, message, data) => {
  return response.status(httpStatus).json({
    message: message,
    res: data,
  });
};

module.exports = { ResponseController };
