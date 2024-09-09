const mongoose = require('mongoose')
const recruiterSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['recruiter'],
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,

        },
        // Fields specific to job seekers
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        // Fields specific to recruiters
        companyName: {
            type: String,
            required: true,
        },
        companyAddress: {
            type: String,
            required: true,
        },
        companyWebsite: {
            type: String,
        },
        companyFacebook: {
            type: String,
        },
        companyDescription: {
            type: String,
            required: true,
        },
        businessLicense: {
            type: String,
            required: true,
        },
        verificationToken: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastOnline: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);
const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;

