const mongoose = require('mongoose')
const recruiterSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            default: 'recruiter',
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
        locationCompanyId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'locationCompany',
        }],
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,

        },

        fullName: {
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

