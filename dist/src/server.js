"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupServer = void 0;
require("./util/module-alias");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const core_1 = require("@overnightjs/core");
const cors_1 = __importDefault(require("cors"));
const database = __importStar(require("@src/database"));
const logger_1 = __importDefault(require("./logger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = __importDefault(require("@src/http/routes"));
const api_schema_json_1 = __importDefault(require("./api-schema.json"));
class SetupServer extends core_1.Server {
    constructor(port = 3000) {
        super();
        this.port = port;
    }
    async init() {
        this.setupExpress();
        await this.docsSetup();
        await this.databaseSetup();
    }
    async docsSetup() {
        this.app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_schema_json_1.default));
    }
    setupExpress() {
        this.app.use(helmet_1.default());
        this.app.use(cors_1.default({ origin: "*" }));
        this.app.set("trust proxy", true);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(routes_1.default);
    }
    getApp() {
        return this.app;
    }
    async databaseSetup() {
        await database.connect();
    }
    async close() {
        await database.close();
    }
    start() {
        this.app.listen(this.port, () => {
            logger_1.default.info("Server listening on port: " + this.port);
        });
    }
}
exports.SetupServer = SetupServer;
//# sourceMappingURL=server.js.map