const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profiles");

const UsersController = require("../controllers/users");

router.get("/:id", ProfileController.GetProfile);
router.get("/:id/profileImage", ProfileController.GetProfileImage);
router.put("/:id/updateFollow", UsersController.UpdateFollow);
router.get(
  "/:id/followers-and-following",
  UsersController.GetFollowersAndFollowing
);

module.exports = router;
