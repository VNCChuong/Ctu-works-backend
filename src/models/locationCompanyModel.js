const mongoose = require('mongoose')

const locationCompanySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
const locationCompany = mongoose.model('locationCompany', locationCompanySchema);
module.exports = locationCompany