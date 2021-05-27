import express,{Request,Response} from "express"

import { UsersController } from "@src/http/controllers/users"
import { ProductsController } from "@src/http/controllers/products"
import { authMiddleware } from "@src/http/middlewares/auth"

const routes = express.Router()
routes.get("/", async (_req, res) => {
    res.json({ version: "Api v0.1.0" })
})

const usersController = new UsersController()

routes.post("/users/permission",authMiddleware,usersController.permission)

routes.post("/users/authenticate", usersController.authenticate)
routes.get("/users/me", authMiddleware, usersController.me)
routes.post("/users", usersController.create)

const productsController = new ProductsController()
routes.put("/products/:id", authMiddleware, productsController.update)
routes.delete("/products/:id", authMiddleware, productsController.delete)
routes.get("/products/:id/status", authMiddleware, productsController.status)
routes.post("/products", authMiddleware, productsController.create)
routes.get("/products", authMiddleware, productsController.get)

routes.get("/products/catalogo", productsController.catalogo)

export default routes
