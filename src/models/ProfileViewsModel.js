const mongoose = require('mongoose')

const profileViewsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    viewDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const profileViews = mongoose.model('profileViews', profileViewsSchema);
module.exports = profileViews