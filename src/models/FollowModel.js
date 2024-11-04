const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    followDate: { type: Date, default: Date.now },
    // companyName: { type: String, required: true },
    // companyLogo: { type: String, defaul: "https://images.vietnamworks.com/img/company-default-logo.svg" },
    // companyIndustries: { type: String, required: true },
    // companyFollowing: { type: Number, required: true },
    // companyJob: { type: Number, default: 0 },
},
    {
        timestamps: true,
    }
);
const follow = mongoose.model('follow', followSchema);
module.exports = follow