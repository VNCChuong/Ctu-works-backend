const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    }
},
    {
        timestamps: true,
    }
);
const notification = mongoose.model('notification', NotificationSchema);
module.exports = notification