"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("config"));
var ExitStatus;
(function (ExitStatus) {
    ExitStatus[ExitStatus["Failure"] = 1] = "Failure";
    ExitStatus[ExitStatus["Success"] = 0] = "Success";
})(ExitStatus || (ExitStatus = {}));
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);
    throw reason;
});
process.on("uncaughtException", (error) => {
    logger_1.default.error(`App exiting due to an uncaught exception: ${error}`);
    process.exit(ExitStatus.Failure);
});
(async () => {
    try {
        const server = new server_1.SetupServer(config_1.default.get("App.port"));
        await server.init();
        server.start();
        const exitSignals = ["SIGINT", "SIGTERM", "SIGQUIT"];
        exitSignals.map((sig) => process.on(sig, async () => {
            try {
                await server.close();
                logger_1.default.info(`App exited with success`);
                process.exit(ExitStatus.Success);
            }
            catch (error) {
                logger_1.default.error(`App exited with error: ${error}`);
                process.exit(ExitStatus.Failure);
            }
        }));
    }
    catch (error) {
        logger_1.default.error(`App exited with error: ${error}`);
        process.exit(ExitStatus.Failure);
    }
})();
//# sourceMappingURL=index.js.map