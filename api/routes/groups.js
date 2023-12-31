const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const GroupController = require("../controllers/groups");
const PostsController = require("../controllers/posts");

// Define routes for groups
router.get("/top", GroupController.GetTopGroups);
router.post("/create", GroupController.Create);
router.get("/all", GroupController.GetAllGroups);
router.get("/:id", GroupController.GetGroup);
router.patch("/:id/addMember", GroupController.AddMember);
router.patch(
  "/:id/image",
  upload.single("image"),
  GroupController.UpdateGroupImage
);
router.patch("/:id/toggleMembership", GroupController.ToggleMembership);
router.patch("/:id/description", GroupController.UpdateDescription);

router.post("/:id/post", PostsController.Create);

module.exports = router;
