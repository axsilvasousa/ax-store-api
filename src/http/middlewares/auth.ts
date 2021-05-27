import { Request, Response, NextFunction } from "express"
import AuthFactoy from "@src/factories/auth"

export function authMiddleware(
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
): void {
    const token = req.headers?.["x-access-token"] as string
    try {
        const decoded = AuthFactoy.decodeToken(token)
        req.decoded = decoded
        next()
    } catch (error) {
        res.status?.(401).send({ code: 401, error: "token invalid" })
    }
}
