const mongoose = require('mongoose');

const CandidateExpectationsSchema = new mongoose.Schema({
    keywords: [String],
    jobField: String,
    language: String,
    minExperience: Number,
    nationality: String,
    educationLevel: String,
    gender: String,
    minAge: {
        type: Number,
        min: 18
    },
    maxAge: {
        type: Number,
        max: 100
    },
    maritalStatus: String,
});

const CandidateExpectations = mongoose.model('CandidateExpectations', CandidateExpectationsSchema);

module.exports = CandidateExpectations;