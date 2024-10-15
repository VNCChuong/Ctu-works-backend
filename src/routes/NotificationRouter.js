const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.post("/apply/:id/notify", NotificationController.sendNotification);

module.exports = router;
