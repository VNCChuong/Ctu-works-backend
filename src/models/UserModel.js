const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['jobSeeker', 'recruiter'],
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
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            // type: Date,
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        desiredFields: {
            type: [String],
            required: true,
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
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

