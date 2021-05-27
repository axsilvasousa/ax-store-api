import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"
import { IUser } from "@src/models/user"

export interface DecodedUser extends Omit<IUser, "_id"> {
    id: string
}

export default class AuthFactory {
    static async hashPassword(password: string, salt = 10): Promise<string> {
        return await bcrypt.hash(password, salt)
    }

    static async comparePassword(
        password: string,
        hashPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword)
    }

    // eslint-disable-next-line
    static generateToken(payload: object): string {
        return jwt.sign(payload, config.get("App.auth.key"), {
            expiresIn: config.get("App.auth.tokenExpiresIn"),
        })
    }

    static decodeToken(token: string): DecodedUser {
        return jwt.verify(token, config.get("App.auth.key")) as DecodedUser
    }
}
