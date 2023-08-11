const app = require("../../app"); // Assuming your express app is exported from this module
const request = require("supertest");
require("../mongodb_helper"); // Assuming you have a helper to connect to MongoDB
const Group = require("../../models/group");
const User = require("../../models/user");
const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

describe("GroupsController", () => {
  let user;
  let token;

  beforeAll(async () => {
    user = new User({
      email: "groupcreator@test.com",
      password: "group12345",
      username: "groupcreator",
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
    await Group.deleteMany({});
  });

  describe("POST /groups/create", () => {
    test("should create a group", async () => {
      const response = await request(app)
        .post("/groups/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Group",
          description: "This is a test group",
          creator: user._id,
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("OK");

      const group = await Group.findOne({ name: "Test Group" });
      expect(group).not.toBeNull();
    });
  });

  describe("GET /groups/:id", () => {
    test("should retrieve a group", async () => {
      const group = new Group({
        name: "Retrieve Test Group",
        description: "Retrieve this test group",
        creator: user._id,
      });
      await group.save();

      const response = await request(app)
        .get(`/groups/${group._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Retrieve Test Group");
    });
  });

  describe("GET /groups/all", () => {
    test("should retrieve all groups", async () => {
      const group1 = new Group({
        name: "Test Group 1",
        description: "This is a test group 1",
        creator: user._id,
      });
      await group1.save();

      const group2 = new Group({
        name: "Test Group 2",
        description: "This is a test group 2",
        creator: user._id,
      });
      await group2.save();

      const response = await request(app)
        .get(`/groups/all`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("PATCH /groups/:id/addMember", () => {
    test("should add a member to the group", async () => {
      const group = new Group({
        name: "Add Member Test Group",
        description: "Add member to this group",
        creator: user._id,
      });
      await group.save();

      const newUser = new User({
        email: "newuser@test.com",
        password: "newuser12345",
        username: "newuser",
      });
      await newUser.save();

      const response = await request(app)
        .patch(`/groups/${group._id}/addMember`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId: newUser._id });

      expect(response.status).toBe(200);
      const updatedGroup = await Group.findById(group._id);
      expect(updatedGroup.members).toContainEqual(newUser._id);
    });
  });

  describe("PATCH /groups/:id/toggleMembership", () => {
    test("should add a user if they aren't already a member and remove if they are", async () => {
      const group = new Group({
        name: "Toggle Membership Test Group",
        description: "Toggle membership for this group",
        creator: user._id,
      });
      await group.save();

      // Test adding the user
      let response = await request(app)
        .patch(`/groups/${group._id}/toggleMembership`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId: user._id });

      expect(response.status).toBe(200);
      let updatedGroup = await Group.findById(group._id);
      expect(updatedGroup.members).toContainEqual(user._id);

      // Test removing the user
      response = await request(app)
        .patch(`/groups/${group._id}/toggleMembership`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userId: user._id });

      expect(response.status).toBe(200);
      updatedGroup = await Group.findById(group._id);
      expect(updatedGroup.members).not.toContainEqual(user._id);
    });
  });

  describe("PATCH /groups/:id/description", () => {
    test("should update the group's description", async () => {
      const group = new Group({
        name: "Update Description Test Group",
        description: "Initial description",
        creator: user._id,
      });
      await group.save();

      const newDescription = "Updated description";

      const response = await request(app)
        .patch(`/groups/${group._id}/description`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: newDescription });

      expect(response.status).toBe(200);
      const updatedGroup = await Group.findById(group._id);
      expect(updatedGroup.description).toBe(newDescription);
    });
  });

});
