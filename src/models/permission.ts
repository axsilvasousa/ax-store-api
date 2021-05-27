import mongoose, { Document, Model, Schema } from "mongoose"

export interface IPermission {
    _id?: string
    module: string
    action: string
}


const schema = new mongoose.Schema(
    {
        module: { type: String, required: true },
        action: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
            },
        },
    }
)

interface PermissionModel extends Omit<IPermission, "_id">, Document {}
export const Permission: Model<PermissionModel> = mongoose.model("Permission", schema)
