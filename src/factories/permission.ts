import {Request} from "express"
import {User, UserModel } from "@src/models/user"
import { Permission } from "@src/models/permission"
import {InternalError} from "@src/util/internal-error"
interface IModule{
    module:string,
    actions:Array<string>
}

export default class PermissionFactory {
    static async isCan(req:Request,module:string,action:string): Promise<void> {
        const email = req.decoded ? req.decoded.email : undefined
        const user = await User.findOne({ email })
        if(user){
            const isAdmin = await PermissionFactory.checkAdmin(user); 
            if(!isAdmin){
                const check = await Permission.findOne({user:user.id,module,action})
                if(!check){
                    throw new InternalError("Usuario não tem permissão",403) ;
                }
            }
        }
    }

    static async setActions(user:UserModel, modules:Array<IModule>){
        const actions = ["create","read","update","delete"];
        return modules.forEach(async element => {
            const {module,actions} = element
            await Permission.deleteMany({ user:user._id,module });
            return actions.forEach(async action => {
                action = action.toLowerCase();
                if(actions.includes(action)){
                    const perm = new Permission({user,module,action})
                    await perm.save()
                }
            });   
        });
    }

    static async getPermissions(){
        return [
            {
                module:"product",
                actions:[
                    "create",
                    "read",
                    "update",
                    "delete"
                ]
            }
        ]
    }

    static async checkAdmin(user:UserModel): Promise<boolean>{
        if(user.email == "john@mail.com"){
            return true;
        }else{
            return false;
        }
    }

   
}