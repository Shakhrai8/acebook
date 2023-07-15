const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profiles");

const UsersController = require("../controllers/users");

router.post("/", UsersController.Create);
router.get("/:id", ProfileController.GetProfile);
router.get("/:id/profileImage", ProfileController.GetProfileImage);

module.exports = router;
