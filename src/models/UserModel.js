const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            default: "jobSeeker",
            // required: true
        },
        MSSV: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        //chuc danh
        jobTitle: {
            type: String,
            required: true
        },
        //bang cap hien tai
        currentDegree: {
            type: String,
            required: true
        },
        //linh vuc hien tai
        currentIndustries: {
            type: String,
            required: true
        },
        //nganh nghe hien tại
        currentJobFunction: {
            type: String,
            required: true
        },
        yearsExperience: {
            type: Number,
            default: 1,
            required: true
        },
        currentSalary: {
            type: Number,
            required: true
        },
        highestDegree: {
            type: String,
            requied: true
        },
        country: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        dateOfBirth: {
            // type: Date,
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        address: {
            type: String,
        },
        gender: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        maritalStatusId: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        avatar: {
            type: String,
            default: ''
        },
        seekJobMode: {
            type: Boolean,
            default: false
        },
        seekJobModeExpiration: {
            type: Date,
        },
        //muc tieu nghe nghiep
        introduce: {
            type: String,
        },

        verificationToken: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastOnline: {
            type: Date
        },
        //cong viec mong muon
        workingPreferences: {
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
                    type: Number
                }
            ],
        },
        //kinh nghiem lam viec
        workingHistories:
            [{
                jobTitle: {
                    type: String,
                    // required: true
                },
                // recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
                companyName: {
                    type: String,
                    // required: true,
                },
                companyLogo: {
                    type: String,
                    default: "https://images.vietnamworks.com/img/company-default-logo.svg"
                },
                fromDate: {
                    type: String
                },
                toDate: {
                    type: String
                },
                description: {
                    type: String,
                    // required: true
                },
                isCurrent: {
                    type: Number,
                    enum: [1, 2]
                }
            }],
        project:
            [{
                projectName: {
                    type: String,
                    // required: true
                },
                //ten khach hang/cong ty
                // recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
                companyName: {
                    type: String,
                    // required: true,
                },
                logo: {
                    type: String,
                    default: "https://images.vietnamworks.com/img/company-default-logo.svg"
                },
                //vai tro cua ban
                yourRole: {
                    type: String,
                    // required: true
                },
                fromDate: {
                    type: String
                },
                toDate: {
                    type: String
                },
                //mo ta du an
                description: {
                    type: String,
                },
                projectLink: {
                    type: String
                }
            }],
        educations: [{
            major: {
                type: String,
                // required: true
            },
            schoolName: {
                type: String,
                // required: true
            },
            //bang cap
            highestDegree: {
                type: String,
                // required: true
            },
            fromDate: {
                type: String
            },
            toDate: {
                type: String
            },
            //thanh tuu
            achievement: {
                type: String,
            }
        }],
        skills: [{
            skillName: {
                type: String,
                required: true,
            },
            skillLevel: {
                type: Number,
                enum: [1, 2, 3, 4, 5],
            }
        }],
        languageSkills: [{
            nameLanguage: {
                type: String,
                // required: true
            },
            languageLevel: {
                type: Number,
                enum: [1, 2, 3, 4],
                // required: true,
            }
        }],
        certifications: [{
            //ten chung chi
            certification: {
                type: String,
                // required: true
            },
            //to chuc
            organization: {
                type: String,
                // required: true
            },
            logo: {
                type: String,
                default: "https://images.vietnamworks.com/img/company-default-logo.svg"

            },
            fromDate: {
                type: String
            },
            linkCertification: {
                type: String
            }
        }],
        activities: [{
            //ten
            activity: {
                type: String,
                // required: true
            },
            //vai tro
            title: {
                type: String,
                // required: true
            },
            // ten to chuc
            organization: {
                type: String,
                // required: true
            },
            fromDate: {
                type: String,

            },
            toDate: {
                type: String,

            },
            isCurrent: {
                type: Number,
                enum: [1, 2]
            },
            description: {
                type: String,
            }
        }]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

