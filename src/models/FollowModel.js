const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    followDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const follow = mongoose.model('follow', followSchema);
module.exports = follow