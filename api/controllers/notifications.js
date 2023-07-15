const Notification = require("../models/notification");
const TokenGenerator = require("../models/token_generator");
const User = require("../models/user");

const NotificationController = {
  Index: (req, res) => {
    Notification.find({ userId: req.user_id }, async (err, notifications) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ notifications: notifications, token: token });
    });
  },
  Delete: (req, res) => {
    Notification.findByIdAndRemove(req.params.id, async (err, notification) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
      } else if (!notification) {
        res.status(404).json({ message: "Notification not found" });
      } else {
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res.status(200).json({ message: "Notification deleted", token: token });
      }
    });
  },
};

module.exports = NotificationController;
