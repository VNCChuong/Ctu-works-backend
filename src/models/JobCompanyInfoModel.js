const mongoose = require('mongoose');

const jobCompanyInfoSchema = new mongoose.Schema({
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
    companyEmail: {
        type: String,
        // required: true
    },
    companyBenefits: [
        {
            title: Number,
            content: String,
        }
    ],
});

const jobCompanyInfo = mongoose.model('jobCompanyInfo', jobCompanyInfoSchema);

module.exports = jobCompanyInfo;