const express = require("express");
const router = express.Router()
const ApplyController = require('../controllers/ApplyController');

router.post('/create',  ApplyController.createApply)

router.put('/update/:id',  ApplyController.updateApply)

router.delete('/delete/:id',  ApplyController.deleteApply)

router.get('/get-my-apply/:id', ApplyController.getMyApply)

module.exports = router