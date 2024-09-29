const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
    // info company
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    companyInfo: {
        companyName: {
            type: String,
            required: true
        },
        companyAddress: {
            type: String,
            required: true
        },
        companySize: {
            type: String,
            required: true
        },
        companyLogo: {
            type: String,
            default: "https://images.vietnamworks.com/img/company-default-logo.svg"
        },
        companyStaffName: {
            type: String,
            required: true
        },
        companyBenefits: [
            {
                title: Number,
                content: String,
            }
        ],
        companyEmail: {
            type: String,
            // required: true
        },
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
        // required: true
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
    jobType: {
        type: String,
        required: true
    },
    minSalary: {
        type: String,
        required: true
    },
    maxSalary: {
        type: String,
        required: true
    },
    jobInformation: {
        datePosted: {
            type: Date,
            default: Date.now
        },
        jobLevel: String,
        jobIndustry: String, // nganh nghe
        keywords: [String],
        jobField: String, // linh vuc
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
    },
    numberOfPositions: Number,

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