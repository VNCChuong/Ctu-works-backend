const express = require("express");
const router = express.Router()
const CreateJobpostAiController = require('../controllers/CreateJobpostAiController')

router.post('/create', CreateJobpostAiController.createJob)

router.post('/get/:id', CreateJobpostAiController.getDetails)

module.exports = router