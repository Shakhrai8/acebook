const User = require("../models/user");
const TokenGenerator = require("../models/token_generator");
const Post = require("../models/post");

const ProfileController = {
  GetProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        const { name, username, bio, followers, following, image } = user;

        // Populate the 'groupId' field of the post
        const posts = await Post.find({ authorId: user._id }).populate(
          "groupId"
        );

        const postData = posts.map((post) => {
          let groupImage = null;

          // Ensure that the post has a group and that the group has an image before we start dealing with the image
          if (post.groupId && post.groupId.image && post.groupId.image.data) {
            const imageBuffer = Buffer.from(post.groupId.image.data.buffer);
            const base64Image = imageBuffer.toString("base64");
            groupImage = `data:${post.groupId.image.contentType};base64,${base64Image}`;

            // Clone the post object and replace the groupId with a new object that contains an image field
            return {
              ...post.toObject(),
              groupId: {
                ...post.groupId.toObject(),
                image: groupImage,
              },
            };
          } else {
            // If the post doesn't have a group or the group doesn't have an image, we return the post as it is
            return post;
          }
        });

        const token = await TokenGenerator.jsonwebtoken(req.params.id);

        res.status(200).json({
          name,
          username,
          bio,
          followers,
          following,
          image,
          posts: postData, // Changed to postData
          token,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  UpdateProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        const { name, bio } = req.body;
        user.name = name || user.name;
        user.bio = bio || user.bio;

        await user.save();
        const token = await TokenGenerator.jsonwebtoken(req.params.id);

        res.status(200).json({
          message: "Profile updated successfully.",
          token,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  UpdateProfileImage: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        if (req.file) {
          user.image.data = req.file.buffer; // Access the buffer from the multer middleware
          user.image.contentType = req.file.mimetype;

          await user.save();
          const token = await TokenGenerator.jsonwebtoken(req.params.id);

          res.status(200).json({
            message: "Profile image updated successfully.",
            token,
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

module.exports = ProfileController;
