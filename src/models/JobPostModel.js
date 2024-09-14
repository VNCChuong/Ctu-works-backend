const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
    // info company
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    conpanyLogo: {
        type: String,
    },
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
    benefits: [
        {
            title: Number,
            content: String,
        }
    ],
    staffName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
        type: String,
        required: true
    },
    //yeu cau cong viec
    jobRequirements: {
        type: String,
        required: true
    },

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
            type: String
        },
    },
    keywords: [String],
    salary: {
        type: String,
        required: true
    },
    //trang thai dang tuyen
    statusSeeking: {
        type: Boolean,
    },
    //trang thai kiem duyet
    statusApproval: {
        type: Boolean,
        default: false
    },
    postViews: {
        type: Number,
    },
});

const jobPost = mongoose.model('jobPost', jobPostSchema);

module.exports = jobPost;