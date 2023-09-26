const Post = require("../models/post");
const Notification = require("../models/notification");
const TokenGenerator = require("../models/token_generator");
const User = require("../models/user");
const fs = require("fs");
const Group = require("../models/group");

const PostsController = {
  Index: (req, res) => {
    Post.find({ groupId: { $exists: false } }, async (err, posts) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ posts: posts, token: token });
    });
  },

  Trending: async (req, res) => {
    try {
      const posts = await Post.find({})
        .sort({ likes: -1 }) // Sort by likes in descending order
        .populate("groupId") // Add this to populate the 'groupId' field
        .limit(5); // Limit to top 5 posts, adjust as needed

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

      res.status(200).json({ posts: postData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  Create: async (req, res) => {
    const timeCalc = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Months are zero-based, so add 1
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
      return `${hours}:${minutes} ${day}-${month}-${year}`;
    };

    try {
      const user = await User.findById(req.user_id);

      const username = user.username;

      const post = new Post({
        username: username,
        time: timeCalc(),
        message: req.body.message,
        authorId: req.user_id,
        groupId: req.body.groupId,
        postedAsGroup: req.body.postedAsGroup || false,
      });

      if (req.file) {
        // Handle image upload if a file is provided
        post.image.data = req.file.buffer; // You should access the buffer directly since you are using multer.memoryStorage()
        post.image.contentType = req.file.mimetype;
      }

      await post.save();

      // Add a check to add the post to the group if a groupId was provided
      if (req.body.groupId) {
        const group = await Group.findById(req.body.groupId);
        if (!group) {
          res.status(404).json({ message: "Group not found" });
        } else {
          await group.updateOne({ $push: { posts: post._id } });
        }
      }

      // searching for any tagged user(@user for example) inside of the posts body message
      const mentionedUsernames = req.body.message?.match(/@(\w+)/g) || [];
      for (let mentionedUsername of mentionedUsernames) {
        const mentionedUser = await User.findOne({
          username: mentionedUsername.replace("@", ""),
        });
        if (mentionedUser) {
          const notification = new Notification({
            type: "mention",
            postId: post._id,
            userId: mentionedUser._id,
            groupId: post.groupId,
            originUserId: req.user_id,
            message: `You have been mentioned in a post by the user @${username}.`,
          });

          await notification.save();
        }
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token, post: post }); // Return the post
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },
  GetImage: (req, res) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
      } else if (!post || !post.image.data) {
        res.status(404).send("Not found");
      } else {
        const image = Buffer.from(post.image.data, "base64");
        res.writeHead(200, {
          "Content-Type": post.image.contentType,
          "Content-Length": image.length,
        });
        res.end(image);
      }
    });
  },

  UpdateLikes: (req, res) => {
    Post.findById(req.params.postId, async (err, post) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
      } else if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        const likes = post.likes.map((like) => like.toString());
        const userId = req.user_id;

        if (likes.includes(userId)) {
          // Remove the like
          post.likes = post.likes.filter((id) => id.toString() !== userId);
        } else {
          // Add the like
          post.likes.push(userId);
        }

        await post.save();
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res.status(200).json({ likes: post.likes, token: token });
      }
    });
  },
};

module.exports = PostsController;
