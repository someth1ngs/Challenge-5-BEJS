const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = ""

describe("Test method POST /auth/register endpoint", () => {
    let name = "Admin"
    let email = "admin@gmail.com"
    let password = "admin123"

    beforeAll(async () => {
        await prisma.user.deleteMany();
    })

    test("Register -> Sukses", async () => {
        try {
            let { statusCode, body } = await request(app)
            .post("/auth/register")
            .send({ name, email, password })
        } catch (err) {
            throw err
        }
    })

    
})