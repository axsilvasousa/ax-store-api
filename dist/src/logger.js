"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_1 = __importDefault(require("config"));
exports.default = pino_1.default({
    enabled: config_1.default.get("App.logger.enabled"),
    level: config_1.default.get("App.logger.level"),
});
//# sourceMappingURL=logger.js.map