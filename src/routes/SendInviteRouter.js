const express = require("express");
const router = express.Router()
const SendInviteController = require('../controllers/SendInviteController');

router.post('/create', SendInviteController.createSendInvite)

router.delete('/delete/:id', SendInviteController.deleteSendInvite)

router.get('/get-my-sendInvite/:id', SendInviteController.getMySendInvite)

router.post('/cancel-send-invite', SendInviteController.cancelSendInvite)
module.exports = router