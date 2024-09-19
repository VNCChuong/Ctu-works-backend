const { BAD_REQUEST } = require("http-status-codes");

const StatusCode = {
  BAD_REQUEST: 400,
  FORBIDEN: 403,
  NOT_FOUND: 404,
};

const ReasonStatusCode = {
  BAD_REQUEST: "Bad request error",
  FORBIDEN: "Forbiden error",
  NOT_FOUND: "Not found error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class ForbidenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDEN,
    statusCode = StatusCode.FORBIDEN
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  ForbidenError,
  NotFoundError,
};
