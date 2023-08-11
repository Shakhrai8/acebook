const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require("../../models/user");
const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

describe("/users", () => {
  beforeAll(async () => {
    const user = new User({
      email: "test@test.com",
      password: "12345678",
      username: "test",
    });
    await user.save();

    token = JWT.sign(
      {
        user_id: user.id,
        iat: Math.floor(Date.now() / 1000) - 5 * 60,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      secret
    );
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      let response = await request(app)
        .post("/user")
        .send({ email: "poppy@email.com", password: "1234", username: "test" });
      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app).post("/user").send({
        email: "scarlett@email.com",
        password: "1234",
        username: "test",
      });
      let users = await User.find();
      let newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarlett@email.com");
    });

    test("a user is created with an image", async () => {
      await request(app).post("/user").send({
        email: "scarlett@email.com",
        password: "1234",
        username: "test",
      });

      let users = await User.find();
      let newUser = users[users.length - 1];

      expect(newUser.email).toEqual("scarlett@email.com");
      expect(newUser.image).toBeDefined();
      expect(newUser.image.contentType).toBe("image/png");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/user")
        .send({ email: "skye@email.com" });
      expect(response.statusCode).toBe(500);
    });

    test("does not create a user", async () => {
      await request(app).post("/user").send({ email: "skye@email.com" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/user")
        .send({ password: "1234" });
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/user").send({ password: "1234" });
      let users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("GET all users", () => {
    test("it should return a list of users", async () => {
      const response = await request(app)
        .get("/users/all")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("PUT UpdateFollow", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      user1 = await new User({
        email: "user1@test.com",
        password: "12345678",
        username: "user1",
      }).save();

      user2 = await new User({
        email: "user2@test.com",
        password: "12345678",
        username: "user2",
      }).save();

      token1 = JWT.sign(
        {
          user_id: user1.id,
          iat: Math.floor(Date.now() / 1000) - 5 * 60,
          exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        secret
      );

      token2 = JWT.sign(
        {
          user_id: user2.id,
          iat: Math.floor(Date.now() / 1000) - 5 * 60,
          exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        secret
      );
    });
    test("it should follow a user", async () => {
      const response = await request(app)
        .put(`/users/${user2._id}/updateFollow`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ user_id: user1._id });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual("User has been followed");

      const updatedUser1 = await User.findById(user1._id);
      expect(updatedUser1.following).toContainEqual(user2._id);
    });

    test("it should unfollow a user", async () => {
      await user1.updateOne({ $push: { following: user2._id } });
      await user2.updateOne({ $push: { followers: user1._id } });

      const response = await request(app)
        .put(`/users/${user2._id}/updateFollow`)
        .set("Authorization", `Bearer ${token1}`)
        .send({ user_id: user1._id });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual("User has been unfollowed");

      const updatedUser1 = await User.findById(user1._id);
      expect(updatedUser1.following).not.toContainEqual(user2._id);
    });
  });
});
