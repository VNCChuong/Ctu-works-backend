const express = require("express");
const router = express.Router()
const CandidateExpectations = require('../controllers/CandidateExpectationsController');

router.post('/create', CandidateExpectations.createCandidateExpectations)

router.put('/update/:id', CandidateExpectations.updateCandidateExpectations)

router.delete('/delete/:id', CandidateExpectations.deleteCandidateExpectations)

router.post('/get-candidate-expectations/:id', CandidateExpectations.getCandidateExpectations)

module.exports = router