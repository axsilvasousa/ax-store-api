"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("@src/models/user");
const permission_1 = require("@src/models/permission");
const internal_error_1 = require("@src/util/internal-error");
class PermissionFactory {
    static async isCan(req, module, action) {
        const email = req.decoded ? req.decoded.email : undefined;
        const user = await user_1.User.findOne({ email });
        if (user) {
            const isAdmin = await PermissionFactory.checkAdmin(user);
            if (!isAdmin) {
                const check = await permission_1.Permission.findOne({ user: user.id, module, action });
                if (!check) {
                    throw new internal_error_1.InternalError("Usuario não tem permissão", 403);
                }
            }
        }
    }
    static async setActions(user, modules) {
        return modules.forEach(async (element) => {
            const { module, actions } = element;
            await permission_1.Permission.deleteMany({ user: user._id, module });
            return actions.forEach(async (action) => {
                const perm = new permission_1.Permission({ user, module, action });
                await perm.save();
            });
        });
    }
    static async getPermissions() {
        return [
            {
                module: "product",
                actions: [
                    "create",
                    "read",
                    "update",
                    "delete"
                ]
            }
        ];
    }
    static async checkAdmin(user) {
        if (user.email == "john@mail.com") {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = PermissionFactory;
//# sourceMappingURL=permission.js.map