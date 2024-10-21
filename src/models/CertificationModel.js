const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    certification: { 
        type: String,
    },
    organization: {
        type: String,
    },
    logo: {
        type: String,
        default: "https://images.vietnamworks.com/img/company-default-logo.svg"
    },
    fromDate: {
        type: Date,
    },
    linkCertification: {
        type: String
    }
});

const activitySchema = new mongoose.Schema({
    activity: { 
        type: String,
    },
    title: { 
        type: String,
    },
    organization: { 
        type: String,
    },
    fromDate: {
        type: Date, 
    },
    toDate: {
        type: Date,
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    }
});

module.exports = {
  certificationSchema,
  activitySchema
};