"use strict";

const statusCodes = require("./statusCodes");
const reasonPhrases = require("./reasonPhrases");

class ErrorResponse {
  constructor(message, statusCode, reasonPhrase) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
  }
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.CONFLICT,
    statusCode = statusCodes.CONFLICT,
    reasonPhrase = reasonPhrases.CONFLICT
  ) {
    super(message, statusCode, reasonPhrase);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.BAD_REQUEST,
    statusCode = statusCodes.BAD_REQUEST,
    reasonPhrase = reasonPhrases.BAD_REQUEST
  ) {
    super(message, statusCode, reasonPhrase);
  }
}

class BadUserRequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.UNAUTHORIZED,
    statusCode = statusCodes.UNAUTHORIZED,
    reasonPhrase = reasonPhrases.UNAUTHORIZED
  ) {
    super(message, statusCode, reasonPhrase);
  }
}

class BadUser2RequestError extends ErrorResponse {
  constructor(
    message = reasonPhrases.FORBIDDEN,
    statusCode = statusCodes.FORBIDDEN,
    reasonPhrase = reasonPhrases.FORBIDDEN
  ) {
    super(message, statusCode, reasonPhrase);
  }
}

module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  BadUserRequestError,
  BadUser2RequestError,
};
