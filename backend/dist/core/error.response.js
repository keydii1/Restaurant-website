"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadUser2RequestError = exports.BadUserRequestError = exports.BadRequestError = exports.ConflictRequestError = exports.ErrorResponse = void 0;
const statusCodes_1 = require("./statusCodes");
const reasonPhrases_1 = require("./reasonPhrases");
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
exports.ErrorResponse = ErrorResponse;
class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonPhrases_1.reasonPhrases.CONFLICT, statusCode = statusCodes_1.statusCodes.CONFLICT, reasonPhrase = reasonPhrases_1.reasonPhrases.CONFLICT) {
        super(message, statusCode, reasonPhrase);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = reasonPhrases_1.reasonPhrases.BAD_REQUEST, statusCode = statusCodes_1.statusCodes.BAD_REQUEST, reasonPhrase = reasonPhrases_1.reasonPhrases.BAD_REQUEST) {
        super(message, statusCode, reasonPhrase);
    }
}
exports.BadRequestError = BadRequestError;
class BadUserRequestError extends ErrorResponse {
    constructor(message = reasonPhrases_1.reasonPhrases.UNAUTHORIZED, statusCode = statusCodes_1.statusCodes.UNAUTHORIZED, reasonPhrase = reasonPhrases_1.reasonPhrases.UNAUTHORIZED) {
        super(message, statusCode, reasonPhrase);
    }
}
exports.BadUserRequestError = BadUserRequestError;
class BadUser2RequestError extends ErrorResponse {
    constructor(message = reasonPhrases_1.reasonPhrases.FORBIDDEN, statusCode = statusCodes_1.statusCodes.FORBIDDEN, reasonPhrase = reasonPhrases_1.reasonPhrases.FORBIDDEN) {
        super(message, statusCode, reasonPhrase);
    }
}
exports.BadUser2RequestError = BadUser2RequestError;
