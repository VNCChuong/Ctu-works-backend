const mongoose = require('mongoose')

const saveJobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    savedDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const saveJob = mongoose.model('saveJob', saveJobSchema);
module.exports = saveJob