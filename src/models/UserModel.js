const mongoose = require('mongoose');
const { workingHistorySchema, projectSchema, educationSchema } = require('./WorkEducationModel');
const { skillSchema, languageSkillSchema } = require('./SkillModel');
const { certificationSchema, activitySchema } = require('./CertificationModel');

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            default: 'jobSeeker',
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
        userInfoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserInfo',
            required: true
        },
        seekJobMode: {
            type: Boolean,
            default: false
        },
        seekJobModeExpiration: {
            type: Date,
        },
        introduce: {
            type: String,
        },
        verificationToken: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastOnline: {
            type: Date,
            default: Date.now
        },
        workingPreferences: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workingPreferences',
            required: true
        },
        introduce: {
            type: String,
        },
        workingHistories: [workingHistorySchema],
        projects: [projectSchema],
        educations: [educationSchema],
        skills: [skillSchema],
        languageSkills: [languageSkillSchema],
        certifications: [certificationSchema],
        activities: [activitySchema]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;