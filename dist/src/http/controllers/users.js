"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const user_1 = require("@src/models/user");
const auth_1 = __importDefault(require("@src/factories/auth"));
const permission_1 = __importDefault(require("@src/factories/permission"));
class UsersController {
    async create(req, res) {
        try {
            const user = new user_1.User(req.body);
            const newUser = await user.save();
            res.status(201).send(newUser);
        }
        catch (error) {
            res.status(400).send({
                message: "Invalid parameters",
                code: "400",
                error: "Bad Request"
            });
        }
    }
    async authenticate(req, res) {
        const { email, password } = req.body;
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                code: 404,
                message: "User not found!",
                description: "Try verifying your email address.",
            });
        }
        const compare = await auth_1.default.comparePassword(password, user.password);
        if (!compare) {
            return res.status(401).send({
                code: 401,
                message: "Password does not match!",
            });
        }
        const token = auth_1.default.generateToken(user.toJSON());
        return res.status(200).send({ id: user.id, name: user.name, token });
    }
    async me(req, res) {
        const email = req.decoded ? req.decoded.email : undefined;
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                code: 404,
                message: "User not found!",
            });
        }
        return res.send({ user });
    }
    async permission(req, res) {
        const email = req.decoded ? req.decoded.email : undefined;
        const user = await user_1.User.findOne({ email });
        if (!user) {
            res.status(404).send({
                code: 404,
                message: "User not found!",
            });
        }
        else {
            try {
                const modules = req.body.permissions;
                await permission_1.default.setActions(user, modules);
                res.status(200).json({ message: "success" });
            }
            catch (error) {
                res.status(500).json({ message: "error interno" });
            }
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.js.map