const Group = require("../models/group");
const fs = require("fs");
const path = require("path");

const defaultImagePath = path.join(
  __dirname,
  "../public/images/default.svg.png"
);

const defaultImage = {
  data: fs.readFileSync(defaultImagePath),
  contentType: "image/png", // Adjust the content type based on your default image format
};

const GroupsController = {
  Create: (req, res) => {
    const { name, description, creator } = req.body;

    const group = new Group({
      name: name,
      description: description,
      creator: req.user_id,
      image: defaultImage,
    });

    group.save((err) => {
      if (err) {
        return res.status(400).json({ message: "Bad request" });
      } else {
        return res.status(201).json({ message: "OK" });
      }
    });
  },

  GetGroup: async (req, res) => {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) {
        res.status(404).json({ message: "Group not found" });
      } else {
        let imageData = null;
        if (group.image && group.image.data) {
          const imageBuffer = Buffer.from(group.image.data.buffer);
          const base64Image = imageBuffer.toString("base64");
          imageData = `data:${group.image.contentType};base64,${base64Image}`;
        }
        res.status(200).json({
          _id: group._id,
          name: group.name,
          description: group.description,
          creator: group.creator,
          members: group.members,
          posts: group.posts,
          image: imageData,
          createdAt: group.createdAt,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  GetAllGroups: async (req, res) => {
    try {
      const groups = await Group.find({});

      const groupData = groups.map((group) => {
        let imageData = null;
        if (group.image && group.image.data) {
          const imageBuffer = Buffer.from(group.image.data.buffer);
          const base64Image = imageBuffer.toString("base64");
          imageData = `data:${group.image.contentType};base64,${base64Image}`;
        }
        return {
          _id: group._id,
          name: group.name,
          description: group.description,
          creator: group.creator,
          members: group.members,
          posts: group.posts,
          image: imageData,
          createdAt: group.createdAt,
        };
      });

      res.status(200).json(groupData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  AddMember: async (req, res) => {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) {
        res.status(404).json({ message: "Group not found" });
      } else {
        if (!group.members.includes(req.body.userId)) {
          // Add member to the group
          await group.updateOne({ $push: { members: req.body.userId } });
          res.status(200).json("User has been added to the group");
        } else {
          res.status(400).json("User is already a member of the group");
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  UpdateGroupImage: async (req, res) => {
    try {
      const group = await Group.findById(req.params.id);

      if (!group) {
        res.status(404).json({ message: "Group not found" });
      } else {
        if (req.file) {
          group.image.data = req.file.buffer; // Access the buffer from the multer middleware
          group.image.contentType = req.file.mimetype;

          await group.save();

          res.status(200).json({
            message: "Group image updated successfully.",
          });
        } else {
          res.status(400).json({ message: "No image file received" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },
};

module.exports = GroupsController;
