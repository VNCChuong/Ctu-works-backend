const mongoose = require('mongoose');
const workingPreferencesSchema = new mongoose.Schema(
    {
        locations: [
            {
                type: String,
                // required: true
            }
        ],
        jobFunction: {
            type: String,
            // required: true
        },
        companyIndustries: [
            {
                type: String,
                required: true
            }
        ],
        desiredJobLevel: {
            type: String,
            // required: true
        },
        salary: {
            type: Number,
            // required: true
        },
        isRelocate: {
            type: Number,
            enum: [1, 2]
        },
        benefits: [
            {
                type: String
            }
        ],

    },
    {
        timestamps: true
    }
)

const WorkingPreferences = mongoose.model("WorkingPreferences", workingPreferencesSchema);
module.exports = WorkingPreferences;