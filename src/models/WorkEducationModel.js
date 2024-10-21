const mongoose = require('mongoose');

const workingHistorySchema = new mongoose.Schema({
    jobTitle: {
        type: String,
    },
    companyName: {
        type: String,
    },
    companyLogo: {
        type: String,
        default: "https://images.vietnamworks.com/img/company-default-logo.svg"
    },
    fromDate: {
        type: Date, 
    },
    toDate: {
        type: Date, 
    },
    description: {
        type: String,
    },
    isCurrent: {
        type: Boolean, 
        default: false
    }
});

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
    },
    companyName: { 
        type: String,
    },
    logo: {
        type: String,
        default: "https://images.vietnamworks.com/img/company-default-logo.svg"
    },
    yourRole: { 
        type: String,
    },
    fromDate: {
        type: Date, 
    },
    toDate: {
        type: Date, 
    },
    description: { 
        type: String,
    },
    projectLink: {
        type: String
    }
});

const educationSchema = new mongoose.Schema({
    major: {
        type: String,
    },
    schoolName: {
        type: String,
    },
    highestDegree: { 
        type: String,
    },
    fromDate: {
        type: Date, 
    },
    toDate: {
        type: Date, 
    },
    achievement: {
        type: String,
    }
});

module.exports = {
  workingHistorySchema,
  projectSchema,
  educationSchema
};