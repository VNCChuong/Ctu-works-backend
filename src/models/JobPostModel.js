const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
    // info company
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    companyName: {
        type: String,
        required: true
    },
    companyScale: {
        type: String,
        required: true
    },
    companyAddress: {
        type: String,
        required: true
    },
    staffName: {
        type: String,
        required: true
    },
    conpanyLogo:{
        type: String,
    },
    // job post
    // chuc danh
    jobTitle: {
        type: String,
        required: true
    },
    // ngay het han
    expirationDate: {
        type: Date,
        required: true
    },
    // dia diem lam viec
    location: {
        type: [String],
        required: true
    },
    // mo ta cong viec
    jobDescription: {
        type: [String],
        required: true
    },
    postViews: {
        type: Number,
    },
    jobRequirements: {
        type: [String],
        required: true
    },
    benefits: [
        {
            title: String,
            content: String,
        }
    ],
    jobInformation: {
        datePosted: {
            type: Date,
            default: Date.now
        },
        jobLevel: String,
        industry: String, // nganh nghe
        skills: [String],
        field: String, // linh vuc
        languageForApplications: String,
        minimumExperience: Number,
        nationality: String,
        minimumEducation: String,
        gender: String,
        preferredAge: {
            type: Number,
            min: 18
        },
        maritalStatus: String,
        numberOfPositions: Number,
        workDays: {
            type: [String], // Ví dụ: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        workHours: {
            type: String, // Ví dụ: '8:00 AM - 5:00 PM'
        },
    },
    keywords: [String],
    salary: {
        type: String,
        required: true
    },
    statusSeeking: {
        type: Boolean,
    },
    statusApproval:{
        type: Boolean,
        default: false
    }
});

const jobPost = mongoose.model('jobPost', jobPostSchema);

module.exports = jobPost;