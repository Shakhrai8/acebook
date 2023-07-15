const User = require("../models/user");
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
  GetProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        const { name, username, bio, followers, image } = user;

        const posts = await Post.find({ authorId: user._id });

        const token = await TokenGenerator.jsonwebtoken(req.params.id);

        res.status(200).json({
          name,
          username,
          bio,
          followers,
          image,
          posts,
          token,
          posts,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },
  GetProfileImage: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user || !user.image.data) {
        res.status(404).json({ message: "Image not found" });
      } else {
        const image = Buffer.from(user.image.data, "base64");
        res.writeHead(200, {
          "Content-Type": user.image.contentType,
          "Content-Length": image.length,
        });
        res.end(image);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },
};

module.exports = UsersController;
