const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user;
let account;

describe("Test method POST /api/v1/accounts endpoint", () => {
  beforeAll(async () => {
    user = await prisma.user.findMany();
  });

  test("Store -> Sukses", async () => {
    try {
      let bank_name = "Mandiri";
      let bank_account_number = "91827364501";
      let balance = 5000000;
      let user_id = user[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });

      account = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("user_id");
      expect(body.data.bank_name).toBe(bank_name);
      expect(body.data.bank_account_number).toBe(bank_account_number);
      expect(body.data.balance).toBe(balance);
      expect(body.data.user_id).toBe(user_id);
    } catch (err) {
      throw err;
    }
  });

  test("Store = user_id tidak dapat ditemukan -> error", async () => {
    try {
      let bank_name = "Mandiri";
      let bank_account_number = "91827364501";
      let balance = 5000000;
      let user_id = user[0].id + 100;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
});

describe("Test method GET /api/v1/accounts endpoint", () => {
  test("Index -> Sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/accounts");

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("bank_name");
      expect(body.data[0]).toHaveProperty("bank_account_number");
      expect(body.data[0]).toHaveProperty("balance");
      expect(body.data[0]).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });
});

describe("Test method GET /api/v1/accounts/:id endpoint", () => {
  test("Show -> Sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${account.id}`
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("user_id");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("password");
      expect(body.data.user).toHaveProperty("profile");
      expect(body.data.user.profile).toHaveProperty("id");
      expect(body.data.user.profile).toHaveProperty("identity_type");
      expect(body.data.user.profile).toHaveProperty("identity_number");
      expect(body.data.user.profile).toHaveProperty("address");
      expect(body.data.user.profile).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("Show = id_akun tidak ditemukan -> error", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${account.id + 100}`
      );

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
});
