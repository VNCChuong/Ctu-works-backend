const express = require("express");
const router = express.Router()
const UserViewsHistoryController = require('../controllers/UserViewsHistoryController');

router.post('/create', UserViewsHistoryController.create)
// router.delete('/delete/:id', UserViewsHistoryController.delete)
router.get('/get/:id', UserViewsHistoryController.get)
module.exports = router
