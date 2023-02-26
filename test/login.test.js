// const {login} = require("../controllers/authContr");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
require("dotenv").config();

describe("login controller", () => {
  beforeAll(() => {
    const { DB_HOST } = process.env;
    mongoose.set("strictQuery", true);
    return mongoose.connect(DB_HOST);
  });

  const credentials = {
    email: "example222@example.com",
    password: "example222",
  };

  test("Response must have status code 200", async () => {
    const resLogin = await supertest(app)
      .post("/api/users/login")
      .send(credentials);
    expect(resLogin.statusCode).toBe(200);
  });

  test("Response should return a token", async () => {
    const resLogin = await supertest(app)
      .post("/api/users/login")
      .send(credentials);
    expect(resLogin.body.token).toBeTruthy();
  });

  test(`Response should return a user object with 2 fields "email" and "subscription", having the data type "String"`, async () => {
    const resLogin = await supertest(app)
      .post("/api/users/login")
      .send(credentials);
    expect(typeof resLogin.body.user).toBe("object");
    expect(typeof resLogin.body.user.email).toBe("string");
    expect(typeof resLogin.body.user.subscription).toBe("string");
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
});
