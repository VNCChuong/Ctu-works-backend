const express = require("express");
const router = express.Router()
const FollowController = require('../controllers/FollowController');

router.post('/create-follow/:id', FollowController.createFollow)
router.delete('/delete-follow/:id', FollowController.deleteFollow)
router.get('/get-my-savejob/:id', FollowController.getMyFollow)
module.exports = router
