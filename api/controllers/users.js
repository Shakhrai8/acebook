const User = require("../models/user");
const Notification = require("../models/notification");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const defaultImagePath = path.join(
  __dirname,
  "../public/images/default.svg.png"
);

const defaultImage = {
  data: fs.readFileSync(defaultImagePath),
  contentType: "image/png", // Adjust the content type based on your default image format
};

const saltRounds = 10; // Number of salt rounds for bcrypt hashing
const JWT = require("jsonwebtoken");

const UsersController = {
  Create: (req, res) => {
    const { email, password, username } = req.body;

    // Generate a hash for the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      const user = new User({
        email: email,
        password: hashedPassword, // Store the hashed password
        username: username,
        image: defaultImage,
      });

      user.save((err) => {
        if (err) {
          return res.status(400).json({ message: "Bad request" });
        } else {
          return res.status(201).json({ message: "OK" });
        }
      });
    });
  },
  UpdateFollow: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user_id);

      if (!user.followers.includes(req.user_id)) {
        // Follow the user
        await user.updateOne({ $push: { followers: req.user_id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });

        const notification = new Notification({
          type: "follow",
          userId: user._id,
          originUserId: req.user_id,
          message: `@${currentUser.username} started following you.`,
        });

        await notification.save();

        res.status(200).json("User has been followed");
      } else {
        // Unfollow the user
        await user.updateOne({ $pull: { followers: req.user_id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = UsersController;
