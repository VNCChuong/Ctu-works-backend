const express = require("express");
const router = express.Router();
const SendInviteController = require("../controllers/SendInviteController");

router.post("/send", SendInviteController.sendInvitation);
router.get("/get-all-invite/:id", SendInviteController.getAllInvitation);

module.exports = router;
