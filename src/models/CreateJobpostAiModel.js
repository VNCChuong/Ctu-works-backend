const mongoose = require('mongoose');

const companyBenefitSchema = new mongoose.Schema({
    title: { type: String, },
    content: { type: String, },
});

const createJobpostAiSchema = new mongoose.Schema({
    jobTitle: { type: String, },
    expirationDate: { type: Date, },
    location: [{ type: String, }], // Assuming location is an array of strings
    jobDescription: { type: String, },
    jobRequirements: { type: String, },
    jobType: { type: String, },
    minSalary: { type: Number, },
    maxSalary: { type: Number, },
    numberOfPositions: { type: Number, },

    jobLevel: { type: String, },
    jobIndustry: { type: String, },
    keywords: { type: [String], },
    jobField: { type: String, },
    language: { type: String, },
    minExperience: { type: Number, },
    nationality: { type: String, },
    educationLevel: { type: String, },
    gender: { type: String, },
    minAge: { type: Number, default: 20 },
    maxAge: { type: Number, default: 30 },
    maritalStatus: { type: String, },


    companyName: { type: String, },
    companyAddress: { type: String, },
    companySize: { type: String, },
    companyLogo: { type: String, },
    companyStaffName: { type: String, },
    companyBenefits: [companyBenefitSchema],
    companyEmail: { type: String, match: /.+\@.+\..+/ },

}, {
    timestamps: true,
});

const createJobpostAi = mongoose.model('createJobpostAi', createJobpostAiSchema);
module.exports = createJobpostAi;