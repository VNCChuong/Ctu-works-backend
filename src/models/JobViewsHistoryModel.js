const mongoose = require('mongoose')

const JobViewsHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    viewDate: { type: Date, default: Date.now },
    timeSpent: { type: Number, required: true },
},
    {
        timestamps: true,
    }
);
const jobviewshistory = mongoose.model('jobviewshistory', JobViewsHistorySchema);
module.exports = jobviewshistory