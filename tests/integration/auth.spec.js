const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = "";
let auth;

describe("Test method POST /api/v1/auth/register endpoint", () => {
  let name = "Admin";
  let email = "admin@gmail.com";
  let password = "admin123";

  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.bank_Account.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  test("Register -> Sukses", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({ name, email, password });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("user");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
    } catch (err) {
      throw err;
    }
  });

  test("Register = Email has already been used! -> error", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({ name, email, password });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("Register = Input must be required -> error", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({});

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("Test method POST /api/v1/auth/login endpoint", () => {
  let email = "admin@gmail.com";
  let password = "admin123";

  test("Login -> Sukses", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("token");
    } catch (err) {
      throw err;
    }
  });

  test("Login = Invalid email or password -> error", async () => {
    try {
        email = "test"
        password = "inibukanpassword"
        let { statusCode, body } = await request(app)
          .post("/api/v1/auth/login")
          .send({ email, password });
  
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      } catch (err) {
        throw err;
      }
  })

  test("Login = Invalid email or password (No Input) -> error", async () => {
    try {
        let { statusCode, body } = await request(app)
          .post("/api/v1/auth/login")
          .send({});
  
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
      } catch (err) {
        throw err;
      }
  })
});
