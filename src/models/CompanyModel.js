const mongoose = require('mongoose')
const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },
        phoneNumber: {
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
        // companyIndustries: {
        //     type: String,
        //     required: true
        // },
        follower: {
            type: [String]
        },
        following: {
            type: Number,
            default: 0
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
        companyBenefits: [
            {
                title: String,
                content: String,
            }
        ],
        staffName: {
            type: String,
        },
        companyJob: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
);
const Company = mongoose.model("Company", companySchema);
module.exports = Company;

