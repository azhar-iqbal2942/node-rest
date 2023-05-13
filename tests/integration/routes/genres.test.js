const request = require("supertest");
const mongoose = require("mongoose");
const { Genres } = require("../../../models/genre");
const { User } = require("../../../models/user");
const config = require("config");

let server;
/**
 * Formula:
 *  Define the happy path, and then in each test, we change
 * one parameter that clearly aligns with the name of the test.
 */

describe("/api/genre", () => {
  // Initial Setup
  beforeEach(async () => {
    await mongoose.connect(config.get("db"));
    server = require("../../../app");
  });
  afterEach(async () => {
    await Genres.deleteMany();
    await mongoose.connection.close();
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);
      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre if id is passed", async () => {
      const genre = new Genres({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
    it("should return 404 if invalid id is passed", async () => {
      const genre = new Genres({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      // here we set value for happy path.if need to test edge case then override that object.
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if token is not provided", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 character", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save if pass valid input data", async () => {
      await exec();

      const genre = await Genres.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });
    it("should return genre if pass valid input data", async () => {
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });
});
