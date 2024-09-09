const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            default: "jobSeeker",
            // required: true
        },
        email: {
            type: String,
            // required: true,
            unique: true
        },
        password: {
            type: String,
            // required: true,
        },
        fullName: {
            type: String,
            // required: true,
        },
        dateOfBirth: {
            // type: Date,
            type: String,
            // required: true,
        },
        phoneNumber: {
            type: String,
            // required: true,
            unique: true
        },
        desiredFields: {
            type: [String],
            // required: true,
        },
        avatar: {
            type: String,
            default: ''
        },
        introduce: {
            type: String,
        },
        seekJobMode: {
            type: Boolean,
            default: false
        },
        seekJobModeExpiration: {
            type: Date,
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
        gender: {
            type: String
        },
        MSSV: {
            type: String
        },
        industry: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

