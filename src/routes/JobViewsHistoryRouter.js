const express = require("express");
const router = express.Router()
const JobViewsHistoryController = require('../controllers/JobViewsHistoryController');

router.post('/create', JobViewsHistoryController.create)
// router.delete('/delete/:id', JobViewsHistoryController.delete)
router.get('/get/:id', JobViewsHistoryController.get)
module.exports = router
