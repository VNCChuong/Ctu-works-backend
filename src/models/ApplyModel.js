const mongoose = require('mongoose')

const applySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    jobPostTitle: { type: String, required: true },
    companyLogo: { type: String, required: true },
    companyName: { type: String, required: true },
    jobLocation: [{ type: String, required: true }],
    jobMinSalary: { type: Number, required: true },
    jobMaxSalary: { type: Number, required: true },
    MSSV: { type: String },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    currentDegree: { type: String, required: true },
    currentIndustries: { type: String, required: true },
    currentJobFunction: { type: String, required: true },
    yearsExperience: { type: String, required: true },
    currentSalary: { type: String, required: true },
    highestDegree: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String },
    gender: { type: String, required: true },
    maritalStatusId: { type: String, required: true },
    workingPreferences: {
        locations: [
            {
                type: String,
                // required: true
            }
        ],
        jobFunction: {
            type: String,
            // required: true
        },
        companyIndustries: [
            {
                type: String,
                required: true
            }
        ],
        desiredJobLevel: {
            type: String,
            // required: true
        },
        salary: {
            type: Number,
            // required: true
        },
        isRelocate: {
            type: Number,
            enum: [1, 2]
        },
        benefits: [
            {
                type: Number
            }
        ],
    },
    status: { type: String, default: "Chờ phản hồi" },
    applyDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const apply = mongoose.model('apply', applySchema);
module.exports = apply