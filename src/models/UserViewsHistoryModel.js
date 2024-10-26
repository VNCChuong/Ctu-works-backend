const mongoose = require('mongoose')

const UserViewsHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    viewDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const userviewshistory = mongoose.model('userviewshistory', UserViewsHistorySchema);
module.exports = userviewshistory