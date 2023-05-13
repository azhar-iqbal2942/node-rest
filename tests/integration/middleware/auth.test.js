const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { Genres } = require("../../../models/genre");

const config = require("config");

let server;

describe("Auth-Middleware", () => {
  let token;

  // Initial Setup
  beforeEach(async () => {
    await mongoose.connect(config.get("db"));
    server = require("../../../app");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genres.deleteMany();
    await mongoose.connection.close();
    server.close();
  });

  it("should return 401 if token is not passed", async () => {
    const resp = await request(server)
      .post("/api/genres")
      .send({ name: "genre1" });

    expect(resp.status).toBe(401);
  });

  it("should return 400 if invalid token is passed", async () => {
    const resp = await request(server)
      .post("/api/genres")
      .set("x-auth-token", "a")
      .send({ name: "genre1" });

    expect(resp.status).toBe(400);
  });

  it("should return 200 if valid token is passed", async () => {
    const resp = await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });

    expect(resp.status).toBe(200);
  });
});
