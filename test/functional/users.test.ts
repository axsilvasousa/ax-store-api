import { User } from "@src/models/user"
import AuthFactory from "@src/factories/auth"

describe("Users functional tests", () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })
    describe("When creating a new user", () => {
        it("should successfully create a new user with encrypted password", async () => {
            const newUser = {
                name: "John Doe",
                email: "john@mail.com",
                password: "1234",
            }
            const response = await global.testRequest
                .post("/users")
                .send(newUser)
            expect(response.status).toBe(201)
            await expect(
                AuthFactory.comparePassword(
                    newUser.password,
                    response.body.password
                )
            ).resolves.toBeTruthy()
            expect(response.body).toEqual(
                expect.objectContaining({
                    ...newUser,
                    ...{ password: expect.any(String) },
                })
            )
        })
        it("Should return validation error", async () => {
            const newUser = {
                email: "john@mail.com",
                password: "1234",
            }
            const response = await global.testRequest
                .post("/users")
                .send(newUser)
            expect(response.status).toBe(400)
        })
    })

    describe("When authenticating  a new user", () => {
        it("should generate a token for valid user ", async () => {
            const newUser = {
                name: "John Doe",
                email: "john@mail.com",
                password: "1234",
            }
            await new User(newUser).save()
            const response = await global.testRequest
                .post("/users/authenticate")
                .send({
                    email: newUser.email,
                    password: newUser.password,
                })
            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                expect.objectContaining({ token: expect.any(String) })
            )
        })
        it("Should return UNAUTHORIZED if the user with the given email is not found", async () => {
            const response = await global.testRequest
                .post("/users/authenticate")
                .send({ email: "some-email@mail.com", password: "1234" })

            expect(response.status).toBe(401)
        })
        it("Should return UNAUTHORIZED if the user is found but the password does not match", async () => {
            const newUser = {
                name: "John Doe",
                email: "john@mail.com",
                password: "1234",
            }
            await new User(newUser).save()
            const response = await global.testRequest
                .post("/users/authenticate")
                .send({ email: newUser.email, password: "different password" })

            expect(response.status).toBe(401)
        })
    })

    describe("When getting user profile info", () => {
        it(`Should return the token's owner profile information`, async () => {
            const newUser = {
                name: "John Doe",
                email: "john@mail.com",
                password: "1234",
            }
            const user = await new User(newUser).save()
            const token = AuthFactory.generateToken(user.toJSON())
            const { body, status } = await global.testRequest
                .get("/users/me")
                .set({ "x-access-token": token })

            expect(status).toBe(200)
            expect(body).toMatchObject(JSON.parse(JSON.stringify({ user })))
        })

        it(`Should return Not Found, when the user is not found`, async () => {
            const newUser = {
                name: "John Doe",
                email: "john@mail.com",
                password: "1234",
            }
            const user = new User(newUser)
            const token = AuthFactory.generateToken(user.toJSON())
            const testRequest =  await global.testRequest
                .get("/users/me")
                .set({ "x-access-token": token })
            expect(testRequest.status).toBe(404)
        })
    })
})
