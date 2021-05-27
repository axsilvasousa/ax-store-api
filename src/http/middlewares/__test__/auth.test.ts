import AuthFactory from "@src/factories/auth"
import { authMiddleware } from "../auth"

describe("AuthMiddleware", () => {
    it("Should verify a jwt token and call the next middleware", () => {
        const jwtToken = AuthFactory.generateToken({ data: "teste" })
        const reqFake = {
            headers: {
                "x-access-token": jwtToken,
            },
        }
        const resFake = {}
        const nextFake = jest.fn()
        authMiddleware(reqFake, resFake, nextFake)
        expect(nextFake).toHaveBeenCalled()
    })
    it("should return UNAUTHORIZED if there is a problem on the token verification", () => {
        const reqFake = {
            headers: {
                "x-access-token": "invalid token",
            },
        }
        const sendMock = jest.fn()
        const resFake = {
            status: jest.fn(() => ({
                send: sendMock,
            })),
        }
        const nextFake = jest.fn()
        // eslint-disable-next-line
        authMiddleware(reqFake, resFake as object, nextFake)
        expect(resFake.status).toHaveBeenCalledWith(401)
        expect(sendMock).toHaveBeenCalledWith({
            code: 401,
            error: "jwt malformed",
        })
    })
})
