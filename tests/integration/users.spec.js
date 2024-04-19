const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let user = {};

// Testing POST Users
describe("Test method POST /api/v1/users endpoint", () => {
  let name = "Dewangga";
  let email = "dewangga@gmail.com";
  let password = "dewangga123";
  let identity_type = "KTP";
  let identity_number = "0000000000000000";
  let address = "Jalan Banyu Urip";

  beforeAll(async () => {
    // await prisma.transaction.deleteMany();
    // await prisma.account.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  test("Store -> Success", async () => {
    try {
      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email,
        password,
        identity_type,
        identity_number,
        address,
      });

      user = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("profile");
      expect(body.data.profile).toHaveProperty("id");
      expect(body.data.profile).toHaveProperty("identity_type");
      expect(body.data.profile).toHaveProperty("identity_number");
      expect(body.data.profile).toHaveProperty("address");
      expect(body.data.profile).toHaveProperty("user_id");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.password).toBe(password);
      expect(body.data.profile.identity_type).toBe(identity_type);
      expect(body.data.profile.identity_number).toBe(identity_number);
      expect(body.data.profile.address).toBe(address);
    } catch (err) {
      throw err;
    }
  });

  test("Store = Input Required -> error", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({});

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });

  test("Store = Email Already Used -> error", async () => {
    try {
      let email = "dewangga@gmail.com";

      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email,
        password,
        identity_type,
        identity_number,
        address,
      });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
});

// Testing GET Users
describe("Test method GET /api/v1/users endpoint", () => {
  test("Index -> Sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get("/api/v1/users");
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("name");
      expect(body.data[0]).toHaveProperty("email");
      expect(body.data[0]).toHaveProperty("password");
    } catch (err) {
      throw err;
    }
  });

  test("Index = User dengan nama tersebut tidak ada -> error", async () => {
    try {
      let response = await request(app).get(`/api/v1/users?search=test`);

      // Lakukan asertasi terhadap status kode dan body respons
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
});

describe("Test method GET by ID /api/v1/users/:id endpoint", () => {
  test("Show -> Sukses", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.id}`)

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("profile");
      expect(body.data.profile).toHaveProperty("id");
      expect(body.data.profile).toHaveProperty("identity_type");
      expect(body.data.profile).toHaveProperty("identity_number");
      expect(body.data.profile).toHaveProperty("address");
      expect(body.data.profile).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("Show = User tidak ditemukan -> error", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.id + 100}`)

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
});
