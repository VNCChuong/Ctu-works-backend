const express = require("express");
const router = express.Router()
const SaveJobController = require('../controllers/SaveJobController');

router.post('/create',  SaveJobController.createSaveJob)

router.delete('/delete/:id',  SaveJobController.deleteSaveJob)

router.get('/get-my-savejob/:id', SaveJobController.getMySaveJob)

router.post('/check-save', SaveJobController.checkSaveJob)
module.exports = router