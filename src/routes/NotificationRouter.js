const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.post("/apply/:id", NotificationController.sendNotification);

router.get("/:userId", NotificationController.getNotifications);

router.put("/read/:notificationId", NotificationController.markAsRead);

router.get("/unread-count/:userId", NotificationController.countUnread);

module.exports = router;
