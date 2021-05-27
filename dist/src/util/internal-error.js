"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
class InternalError extends Error {
    constructor(message, code = 500, description) {
        super(message);
        this.message = message;
        this.code = code;
        this.description = description;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=internal-error.js.map