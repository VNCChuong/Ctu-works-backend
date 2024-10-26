const mongoose = require('mongoose');
const userInfoSchema = new mongoose.Schema(
    {
        MSSV: {
            type: String
        },
        fullName: {
            type: String,
            required: true,
        },
        //chuc danh
        jobTitle: {
            type: String,
            required: true
        },
        //bang cap hien tai
        currentDegree: {
            type: String,
            required: true
        },
        //linh vuc hien tai
        currentIndustries: {
            type: String,
            required: true
        },
        //nganh nghe hien tại
        currentJobFunction: {
            type: String,
            required: true
        },
        yearsExperience: {
            type: Number,
            default: 1,
            required: true
        },
        currentSalary: {
            type: Number,
            required: true
        },
        highestDegree: {
            type: String,
            requied: true
        },
        country: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
        dateOfBirth: {
            // type: Date,
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        address: {
            type: String,
        },
        gender: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        maritalStatusId: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        avatar: {
            type: String,
            default: ''
        },
    },
    {
        timestamps: true
    }
)

const UserInfo = mongoose.model("UserInfo", userInfoSchema);
module.exports = UserInfo;