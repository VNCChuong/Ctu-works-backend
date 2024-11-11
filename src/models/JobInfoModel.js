const mongoose = require('mongoose');

const JobInfoSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: [String],
        required: true
    },
    // mo ta cong viec
    jobDescription: {
        type: String,
        required: true
    },
    //yeu cau cong viec
    jobRequirements: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    minSalary: {
        type: String,
        required: true
    },
    maxSalary: {
        type: String,
        required: true
    },
    canDeal: {
        type: Boolean,
        default: false
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    jobLevel: { type: String, },
    jobIndustry: { type: String }


});

const JobInfo = mongoose.model('JobInfo', JobInfoSchema);

module.exports = JobInfo;