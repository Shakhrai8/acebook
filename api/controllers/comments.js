const Comment = require("../models/comment");
const TokenGenerator = require("../models/token_generator");
const User = require("../models/user");
const Notification = require("../models/notification");
const Post = require("../models/post");

const CommentsController = {
  Index: (req, res) => {
    Comment.find(async (err, comments) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ comments: comments, token: token });
    });
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
      const post = await Post.findById(req.body.postId);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const username = user.username;

      const comment = new Comment({
        username: username,
        time: timeCalc(),
        comment: req.body.comment,
        postId: req.body.postId,
        authorId: req.user_id,
      });

      await comment.save();

      // Send notification to the post's author if the author is not the one who commented
      if (req.user_id.toString() !== post.authorId.toString()) {
        const notification = new Notification({
          type: "comment",
          commentId: comment._id,
          userId: comment.authorId,
          originUserId: req.user_id,
          message: `New comment on your post by @${username}`,
        });

        await notification.save();
      }

      const mentionedUsernames = req.body.comment?.match(/@(\w+)/g) || [];
      for (let mentionedUsername of mentionedUsernames) {
        const mentionedUser = await User.findOne({
          username: mentionedUsername.replace("@", ""),
        });
        if (mentionedUser) {
          const notification = new Notification({
            type: "mention",
            commentId: comment._id,
            userId: mentionedUser._id,
            originUserId: req.user_id,
            message: `You have been mentioned in a post by the user @${username}.`,
          });

          await notification.save();
        }
      }

      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token, comment: comment }); // Return the comment
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.toString() });
    }
  },

  UpdateLikes: (req, res) => {
    Comment.findById(req.params.commentId, async (err, comment) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
      } else if (!comment) {
        res.status(404).json({ message: "Post not found" });
      } else {
        const likes = comment.likes.map((like) => like.toString());
        const userId = req.user_id;

        if (likes.includes(userId)) {
          // Remove the like
          comment.likes = comment.likes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          // Add the like
          comment.likes.push(userId);
        }

        await comment.save();
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res.status(200).json({ likes: comment.likes, token: token });
      }
    });
  },
};

module.exports = CommentsController;
