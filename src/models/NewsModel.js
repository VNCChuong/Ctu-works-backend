const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
    }
);
const news = mongoose.model('news', newsSchema);
module.exports = news