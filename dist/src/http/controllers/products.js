"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const product_1 = require("@src/models/product");
const permission_1 = __importDefault(require("@src/factories/permission"));
class ProductsController {
    constructor() {
        this.get = this.get.bind(this);
    }
    async catalogo(req, res) {
        const limit = 10;
        let page = 0;
        if (req.query && req.query.page) {
            page = parseInt(req.query.page);
        }
        let nexPage = (page + limit) || null;
        const filter = {
            status: "ATIVO",
        };
        const products = await product_1.Product.find(filter)
            .sort("price")
            .limit(limit)
            .skip(page);
        const countProduct = await product_1.Product.find(filter);
        if (nexPage != null && nexPage > countProduct.length) {
            nexPage = null;
        }
        res.status(200).json({ items: products, next: nexPage });
    }
    async get(req, res) {
        const limit = 10;
        let page = 0;
        if (req.query && req.query.page) {
            page = parseInt(req.query.page);
        }
        let nexPage = (page + limit) || null;
        const filter = this.filterProduct(req.query);
        const products = await product_1.Product.find(filter)
            .sort("created")
            .limit(limit)
            .skip(page);
        const countProduct = await product_1.Product.find(filter);
        if (nexPage != null && nexPage > countProduct.length) {
            nexPage = null;
        }
        res.status(200).json({ items: products, nexPage });
    }
    async create(req, res) {
        var _a;
        try {
            const data = { ...req.body, ...{ user: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.id } };
            const product = new product_1.Product({ ...data, created: new Date() });
            const payload = await product.save();
            res.status(201).send(payload);
        }
        catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const update = { ...req.body, updated: new Date() };
            const filter = { _id: req.params.id };
            await product_1.Product.updateOne(filter, update);
            const product = await product_1.Product.findOne(filter);
            res.status(200).json(product);
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }
    async status(req, res) {
        try {
            const filter = { _id: req.params.id };
            await product_1.Product.updateOne(filter, { status: req.body.status });
            res.status(200).json({ message: "success" });
        }
        catch (error) {
            res.status(404).send({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            await permission_1.default.isCan(req, "product", "delete");
            const filter = { _id: req.params.id };
            try {
                await product_1.Product.deleteOne(filter);
                res.status(200).json({ message: "success" });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        }
        catch (error) {
            res.status(error.code).json({ message: error.message });
        }
    }
    filterProduct(body) {
        const filter = {};
        if (body.title) {
            filter.title = { $regex: body === null || body === void 0 ? void 0 : body.title, $options: "i" };
        }
        if (body.priceMin) {
            filter.price = { ...filter.price, $gte: body.priceMin };
        }
        if (body.priceMax) {
            filter.price = { ...filter.price, $lte: body.priceMax };
        }
        if (body.status) {
            filter.status = body.status;
        }
        return filter;
    }
}
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.js.map