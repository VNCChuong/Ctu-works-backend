const mongoose = require('mongoose')
const recruiterSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            default: 'recruiter',
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
        fullName: {
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
        companyLogo: {
            type: String,
            default: "https://images.vietnamworks.com/img/company-default-logo.svg"
        },
        companyAddress: {
            type: String,
            required: true,
        },
        companyScale: {
            type: String,
        },
        companyIndustries: {
            type: String,
            required: true
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
        benefits: [
            {
                title: Number,
                content: String,
            }
        ],
        location: [
            {
                locationName: {
                    type: String,
                },
                address: {
                    type: String
                }
            }
        ],

        verificationToken: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastOnline: {
            type: Date
        },
        follower: {
            type: [String]
        },
        following: {
            type: Number,
            default: 0
        },

    },
    {
        timestamps: true
    }
);
const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;

