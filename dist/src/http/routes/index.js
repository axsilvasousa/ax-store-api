"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("@src/http/controllers/users");
const products_1 = require("@src/http/controllers/products");
const auth_1 = require("@src/http/middlewares/auth");
const routes = express_1.default.Router();
routes.get("/", async (_req, res) => {
    res.json({ version: "Api v0.1.0" });
});
const usersController = new users_1.UsersController();
routes.post("/users/permission", auth_1.authMiddleware, usersController.permission);
routes.post("/users/authenticate", usersController.authenticate);
routes.get("/users/me", auth_1.authMiddleware, usersController.me);
routes.post("/users", usersController.create);
const productsController = new products_1.ProductsController();
routes.put("/products/:id", auth_1.authMiddleware, productsController.update);
routes.delete("/products/:id", auth_1.authMiddleware, productsController.delete);
routes.get("/products/:id/status", auth_1.authMiddleware, productsController.status);
routes.post("/products", auth_1.authMiddleware, productsController.create);
routes.get("/products", auth_1.authMiddleware, productsController.get);
routes.get("/products/catalogo", productsController.catalogo);
exports.default = routes;
//# sourceMappingURL=index.js.map