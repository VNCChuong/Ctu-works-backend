const mongoose = require('mongoose')

const saveJobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    jobTitle: { type: String, required: true },
    companyLogo: { type: String, required: true },
    companyName: { type: String, required: true },
    jobLocation: [{ type: String, required: true }],
    jobSalary: { type: String, required: true },
    savedDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const saveJob = mongoose.model('saveJob', saveJobSchema);
module.exports = saveJob