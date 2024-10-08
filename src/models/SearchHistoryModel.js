const mongoose = require('mongoose')

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    savedDate: { type: Date, default: Date.now },
},
    {
        timestamps: true,
    }
);
const searchHistory = mongoose.model('searchHistory', searchHistorySchema);
module.exports = searchHistory