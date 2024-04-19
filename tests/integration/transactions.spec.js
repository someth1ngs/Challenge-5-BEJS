const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user;
let account;
let account2;
let transaction;

describe("Test method POST /api/v1/transactions endpoint", () => {
  beforeAll(async () => {
    account = await prisma.bank_Account.findMany();
    user = await prisma.user.findMany();

    // Untuk akun lain agar bisa melakukan transaksi
    try {
      let bank_name = "BNI";
      let bank_account_number = "12345678910";
      let balance = 1000000;
      let user_id = user[0].id;

      const { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id });

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

      account2 = body.data;
    } catch (err) {
      throw err;
    }
  });

  test("Store -> Sukses", async () => {
    try {
      let source_account_id = account[0].id;
      let destination_account_id = account2.id;
      let amount = 50000;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ source_account_id, destination_account_id, amount });

      transaction = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
    } catch (err) {
      throw err;
    }
  });

  test("Store = Saldo tidak mencukupi -> error", async () => {
    try {
      let amount = 99999999999;
      let source_account_id = account[0].id;
      let destination_account_id = account2.id;

      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ source_account_id, destination_account_id, amount });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
  test("Store = Untuk pengirim atau penerima tidak valid -> error", async () => {
    try {
        let amount = 1;
        let source_account_id = account[0].id + 100;
        let destination_account_id = account2.id + 100;
  
        let { statusCode, body } = await request(app)
          .post("/api/v1/transactions")
          .send({ source_account_id, destination_account_id, amount });
  
        expect(statusCode).toBe(404);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
});

describe("Test method GET /api/v1/transactions endpoint", () => {
    test("Index -> Sukses", async () => {
        try {
            let { statusCode, body } = await request(app).get("/api/v1/transactions")
    
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("status");
            expect(body).toHaveProperty("message");
            expect(body).toHaveProperty("data");
            expect(body.data[0]).toHaveProperty("id");
            expect(body.data[0]).toHaveProperty("amount");
            expect(body.data[0]).toHaveProperty("source_account_id");
            expect(body.data[0]).toHaveProperty("destination_account_id");
        } catch (err) {
            throw err
        }
    })
})

describe("Test method GET by Id /api/v1/transactions/:id endpoint", () => {
    test("Show -> Sukses", async () => {
        try {
            let { statusCode, body } = await request(app).get(
                `/api/v1/transactions/${transaction.id}`
              );
    
              expect(statusCode).toBe(200);
              expect(body).toHaveProperty("status");
              expect(body).toHaveProperty("message");
              expect(body).toHaveProperty("data");
              expect(body.data).toHaveProperty("id");
              expect(body.data).toHaveProperty("amount");
              expect(body.data).toHaveProperty("source_account_id");
              expect(body.data).toHaveProperty("destination_account_id");
              expect(body.data).toHaveProperty("sourceAccounts");
              expect(body.data.sourceAccounts).toHaveProperty("id");
              expect(body.data.sourceAccounts).toHaveProperty("bank_name");
              expect(body.data.sourceAccounts).toHaveProperty("bank_account_number");
              expect(body.data.sourceAccounts).toHaveProperty("balance");
              expect(body.data.sourceAccounts).toHaveProperty("user_id");
              expect(body.data).toHaveProperty("destinationAccounts");
              expect(body.data.destinationAccounts).toHaveProperty("id");
              expect(body.data.destinationAccounts).toHaveProperty("bank_name");
              expect(body.data.destinationAccounts).toHaveProperty("bank_account_number");
              expect(body.data.destinationAccounts).toHaveProperty("balance");
              expect(body.data.destinationAccounts).toHaveProperty("user_id");
        } catch (err) {
            throw err
        }
    })
})