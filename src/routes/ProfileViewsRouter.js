const express = require("express");
const router = express.Router()
const ProfileViewsController = require('../controllers/ProfileViewsController');

router.post('/create',  ProfileViewsController.createProfileViews)

router.get('/get-my-profile-views/:id', ProfileViewsController.getMyProfileViews)

module.exports = router