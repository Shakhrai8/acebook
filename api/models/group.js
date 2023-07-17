const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  image: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
