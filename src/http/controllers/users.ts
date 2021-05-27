import { Response, Request } from "express"
import { User } from "@src/models/user"
import AuthFactory from "@src/factories/auth"
import PermissionFactory from "@src/factories/permission"

export class UsersController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body)
            const newUser = await user.save()
            res.status(201).send(newUser)
        } catch (error) {
            res.status(400).send({ 
                message: "Invalid parameters",
                code: "400",
                error: "Bad Request" 
            })
        }
    }

    public async authenticate(
        req: Request,
        res: Response
    ): Promise<Response | undefined> {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({
                code: 404,
                message: "User not found!",
                description: "Try verifying your email address.",
            })
        }
        const compare = await AuthFactory.comparePassword(password, user.password);
        if (!compare) {
            return res.status(401).send({
                code: 401,
                message: "Password does not match!",
            })
        }
        const token = AuthFactory.generateToken(user.toJSON())
        return res.status(200).send({id:user.id, name:user.name, token })
    }

    public async me(req: Request, res: Response): Promise<Response> {
        const email = req.decoded ? req.decoded.email : undefined
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({
                code: 404,
                message: "User not found!",
            })
        }
        
        return res.send({ user })
    }

    public async permission(req: Request, res: Response): Promise<void> {
        const email = req.decoded ? req.decoded.email : undefined
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).send({
                code: 404,
                message: "User not found!",
            })
        }else{
            try {
                const modules = req.body.permissions 
                await PermissionFactory.setActions(user,modules);
                res.status(200).json({message:"success"})
            } catch (error) {
                res.status(500).json({message:"error interno"})
            }
        }
    }
}
