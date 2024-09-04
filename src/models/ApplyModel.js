const mongoose = require('mongoose')

const applySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    status: {type: String, default: "Chờ phản hồi"},
    applyDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const apply = mongoose.model('apply', applySchema);
module.exports = apply