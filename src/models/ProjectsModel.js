const mongoose = require('mongoose');

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

// const Project = mongoose.model("Project", projectSchema);
module.exports = projectSchema