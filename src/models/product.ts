import mongoose, { Document, Model, Schema } from "mongoose"

export interface IProduct {
    _id?: string
    title: string
    description: string
    status: string
    price: number
    created?: Date
    updated?: Date
}

export interface IProductSearch {
    title?:string;
    priceMin?:number;
    priceMax?:number;
    status?:string
}
export interface IProductFilter{
    title?: { $regex: string, $options: string };
    price?:{
        $gte?:number;
        $lte?:number;
    };
    status?:string
}

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, required: true },
        price: { type: Schema.Types.Decimal128, required: true },
        created: { type: Date },
        updated: { type: Date },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id
                if (ret.price) {
                    ret.price = ret.price.toString()
                }
                delete ret._id
                delete ret.__v
            },
        },
    }
)

interface ProductModel extends Omit<IProduct, "_id">, Document {}
export const Product: Model<ProductModel> = mongoose.model("Product", schema)
