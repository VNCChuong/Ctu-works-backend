const mongoose = require('mongoose')

const sendInviteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    status: { type: String, default: 'Chờ phản hồi' },
    dayEnd: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    sendDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const sendInvite = mongoose.model('sendInvite', sendInviteSchema);
module.exports = sendInvite