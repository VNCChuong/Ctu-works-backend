const express = require("express");
const router = express.Router();
const SendInviteController = require("../controllers/SendInviteController");

router.post("/send", SendInviteController.sendInvitation);

module.exports = router;
