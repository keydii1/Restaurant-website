"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Created = exports.OK = exports.SuccessResponse = void 0;
const statusCodes_1 = require("./statusCodes");
const reasonPhrases_1 = require("./reasonPhrases");
class SuccessResponse {
    constructor(options) {
        const { message = "", statusCode = statusCodes_1.statusCodes.OK, reasonPhrasesCode = reasonPhrases_1.reasonPhrases.OK, metadata = {}, } = options;
        this.message = !message ? reasonPhrasesCode : message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
    send(res, header = {}) {
        return res.status(this.statusCode).json(this);
    }
}
exports.SuccessResponse = SuccessResponse;
class OK extends SuccessResponse {
    constructor(options = {}) {
        const { message = "", statusCode = statusCodes_1.statusCodes.OK, reasonPhrasesCode = reasonPhrases_1.reasonPhrases.OK, metadata = {}, } = options;
        super({ message, statusCode, reasonPhrasesCode, metadata });
    }
}
exports.OK = OK;
class Created extends SuccessResponse {
    constructor(options = {}) {
        const { message = "", statusCode = statusCodes_1.statusCodes.CREATED, reasonPhrasesCode = reasonPhrases_1.reasonPhrases.CREATED, metadata = {}, } = options;
        super({ message, statusCode, reasonPhrasesCode, metadata });
    }
}
exports.Created = Created;
