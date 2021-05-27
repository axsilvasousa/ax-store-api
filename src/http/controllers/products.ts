import { Response, Request } from "express"
import { Product, IProductSearch, IProductFilter } from "@src/models/product"
import PermissionFactory from "@src/factories/permission"
import { User } from "@src/models/user"


export class ProductsController {
    constructor() {
        this.get = this.get.bind(this)
    }
    public async catalogo(req: Request, res: Response):Promise<void> {
        const limit = 10
        let page = 0
        if (req.query && req.query.page) {
            page = parseInt((req.query.page as string))
        }
        let nexPage = ((page + limit) as number) || null
        const filter = {
            status: "ATIVO",
        }
        const products = await Product.find(filter)
            .sort("price")
            .limit(limit)
            .skip(page)

        const countProduct = await Product.find(filter)
        if (nexPage != null && nexPage > countProduct.length) {
            nexPage = null
        }
        res.status(200).json({ items: products, next: nexPage })
    }

    public async get(req: Request, res: Response):Promise<void> {
        try {
            await PermissionFactory.isCan(req,"product","read");
            const limit = 10
            let page = 0
            if (req.query && req.query.page) {
                page = parseInt((req.query.page as string))
            }
            let nexPage = ((page + limit) as number) || null
            const filter = this.filterProduct(req.query)

            const products = await Product.find(filter)
                .sort("created")
                .limit(limit)
                .skip(page)

            const countProduct = await Product.find(filter)
            if (nexPage != null && nexPage > countProduct.length) {
                nexPage = null
            }
            res.status(200).json({ items: products, nexPage })
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message })
        }
    }

    public async create(req: Request, res: Response) :Promise<void>{
        try {
            await PermissionFactory.isCan(req,"product","create");
            const data = { ...req.body, ...{ user: req.decoded?.id } }
            const product = new Product({ ...data, created: new Date() })
            const payload = await product.save()
            res.status(201).send(payload)
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message })
        }
    }

    public async update(req: Request, res: Response):Promise<void> {
        try {
            await PermissionFactory.isCan(req,"product","update");
            const update = { ...req.body, updated: new Date() }
            const filter = { _id: req.params.id }
            await Product.updateOne(filter, update)
            const product = await Product.findOne(filter)
            res.status(200).json(product)
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message })
        }
    }

    public async status(req: Request, res: Response):Promise<void> {
        try {
            const filter = { _id: req.params.id }
            await Product.updateOne(filter, { status: req.body.status })
            res.status(200).json({ message: "success" })
        } catch (error) {
            res.status(404).send({ message: error.message })
        }
    }

    public async delete(req: Request, res: Response):Promise<void> {
        try {
            await PermissionFactory.isCan(req,"product","delete");
            const filter = { _id: req.params.id }
            try {
                await Product.deleteOne(filter)
                res.status(200).json({ message: "success"})
            } catch (error) {
                res.status(404).json({ message: error.message })
            }
            
        } catch (error) {
            res.status(error.code).json({ message: error.message })
        }
            
    }

    private filterProduct(body: IProductSearch) {
        const filter: IProductFilter = {}
        if (body.title) {
            filter.title = { $regex: body?.title, $options: "i" }
        }

        if (body.priceMin) {
            filter.price = { ...filter.price, $gte: body.priceMin }
        }

        if (body.priceMax) {
            filter.price = { ...filter.price, $lte: body.priceMax }
        }
        if (body.status) {
            filter.status = body.status
        }
        return filter
    }
}
