const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const { sendVerificationEmail } = require("./EmailService");
const crypto = require("crypto");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");
const UserInfo = require("../models/UserInfoModel");
const WorkingPreferences = require("../models/WorkingPreferencesModel");
// const Projects = require("../models/ProjectsModel")
const mongoose = require("mongoose");
const {
  workingHistorySchema,
  projectSchema,
  educationSchema,
} = require("../models//WorkEducationModel");
const { skillSchema, languageSkillSchema } = require("../models/SkillModel");
const {
  certificationSchema,
  activitySchema,
} = require("../models/CertificationModel");
const Skill = mongoose.model("Skill", skillSchema);
const Language = mongoose.model("Language", languageSkillSchema);
const Certification = mongoose.model("Certification", certificationSchema);
const Activity = mongoose.model("Activity", activitySchema);
const Project = mongoose.model("Project", projectSchema);
const WorkingHistory = mongoose.model("WorkingHistory", workingHistorySchema);
const Education = mongoose.model("Education", educationSchema);

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {
      fullName,
      phoneNumber,
      email,
      password,
      dateOfBirth,
      gender,
      country,
      city,
      district,
      address,
      maritalStatusId,
      jobTitle,
      yearsExperience,
      currentDegree,
      highestDegree,
      currentSalary,
      currentJobFunction,
      currentIndustries,
      skillName,
      workingPreferences,
      confirmPassword,
      MSSV,
    } = newUser;
    const { companyIndustries } = workingPreferences;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The email is already",
        });
      }
      const checkPhone = await UserInfo.findOne({
        phoneNumber: phoneNumber,
      });
      if (checkPhone !== null) {
        resolve({
          status: "ERR",
          message: "Phone number is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const createUserInfo = await UserInfo.create({
        MSSV,
        fullName,
        jobTitle,
        currentDegree,
        currentIndustries,
        currentJobFunction,
        yearsExperience,
        address,
        gender,
        currentSalary,
        maritalStatusId,
        dateOfBirth,
        phoneNumber,
        highestDegree,
        country,
        city,
        district,
      });
      const workingPreferences = await WorkingPreferences.create({
        companyIndustries,
      });
      const createdUser = await User.create({
        email,
        password: hash,
        skillName,
        workingPreferences,
        userInfoId: createUserInfo._id,
        verificationToken,
        seekJobMode: false,
      });

      const verificationLink = `${process.env.APP_URL}/auth/verify/${verificationToken}`;
      await sendVerificationEmail(email, verificationLink);

      if (createdUser) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password is incorrect 1",
        });
      }
      if (!checkUser.isVerified) {
        resolve({
          status: "ERR",
          message: "Account not verified",
        });
      }
      const access_token = await genneralAccessToken({
        userid: checkUser.id,
        email: checkUser.email,
        fullName: checkUser.fullName,
        role: checkUser.role,
      });

      const refresh_token = await genneralRefreshToken({
        userid: checkUser.id,
        email: checkUser.email,
        fullName: checkUser.fullName,
        role: checkUser.role,
      });
      resolve({
        status: "OK",
        message: "Login success",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const UserInfoId = checkUser.userInfoId.toString();
      const {
        MSSV,
        fullName,
        jobTitle,
        currentDegree,
        currentIndustries,
        currentJobFunction,
        yearsExperience,
        address,
        gender,
        currentSalary,
        maritalStatusId,
        dateOfBirth,
        phoneNumber,
        highestDegree,
        country,
        city,
        district,
      } = data;
      const dataUserInfo = {
        MSSV,
        fullName,
        jobTitle,
        currentDegree,
        currentIndustries,
        currentJobFunction,
        yearsExperience,
        address,
        gender,
        currentSalary,
        maritalStatusId,
        dateOfBirth,
        phoneNumber,
        highestDegree,
        country,
        city,
        district,
      };
      const updateUser = await UserInfo.findByIdAndUpdate(
        UserInfoId,
        dataUserInfo,
        { new: true }
      );
      resolve({
        status: "OK",
        message: "Success",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 });

      const data = await Promise.all(
        allUser.map(async (item) => {
          try {
            const userDetails = await getDetailsUser(item._id.toString());
            return userDetails.data;
          } catch (e) {
            console.error(
              `Error getting job details for ${item.jobPostId}:`,
              e
            );
            return null;
          }
        })
      );

      resolve({
        status: "OK",
        message: "Success",
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      const userInfo = await UserInfo.findById({
        _id: user.userInfoId,
      });
      const workingPreferences = await WorkingPreferences.findById({
        _id: user.workingPreferences,
      });
      const {
        MSSV,
        fullName,
        jobTitle,
        currentDegree,
        currentIndustries,
        currentJobFunction,
        yearsExperience,
        currentSalary,
        highestDegree,
        country,
        phoneNumber,
        dateOfBirth,
        city,
        district,
        address,
        gender,
        maritalStatusId,
        avatar,
      } = userInfo;
      const { locations, companyIndustries, benefits } = workingPreferences;
      const {
        _id,
        role,
        email,
        userInfoId,
        seekJobMode,
        lastOnline,
        workingHistories,
        projects,
        educations,
        skills,
        languageSkills,
        certifications,
        activities,
        introduce,
      } = user;
      const data = {
        _id,
        role,
        email,
        userInfoId,
        seekJobMode,
        lastOnline,
        workingHistories,
        projects,
        skills,
        educations,
        introduce,
        languageSkills,
        certifications,
        activities,
        locations,
        companyIndustries,
        benefits,
        MSSV,
        fullName,
        jobTitle,
        currentDegree,
        currentIndustries,
        currentJobFunction,
        yearsExperience,
        currentSalary,
        highestDegree,
        country,
        phoneNumber,
        dateOfBirth,
        city,
        district,
        address,
        gender,
        maritalStatusId,
        avatar,
        workingPreferences,
        userInfo,
      };
      if (user === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const today = new Date();
      if (user.seekJobModeExpiration < today) {
        await User.findByIdAndUpdate(
          { _id: id },
          {
            seekJobMode: false,
            seekJobModeExpiration: null,
          }
        );
      }
      resolve({
        status: "OK",
        message: "Success",
        data: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const changePassword = (userInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, oldPass, newPass } = userInfo;
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(oldPass, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password is incorrect 1",
        });
      }
      const hash = bcrypt.hashSync(newPass, 10);
      await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          password: hash,
        },
        {
          new: true,
        }
      );
      const access_token = await genneralAccessToken({
        userid: checkUser.id,
        email: checkUser.email,
        fullName: checkUser.fullName,
        role: checkUser.role,
      });

      const refresh_token = await genneralRefreshToken({
        userid: checkUser.id,
        email: checkUser.email,
        fullName: checkUser.fullName,
        role: checkUser.role,
      });
      // console.log('access_token',access_token)
      resolve({
        status: "OK",
        message: "Success",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateSeekJob = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 15);
      await User.findByIdAndUpdate(
        { _id: id },
        {
          seekJobMode: !checkUser.seekJobMode,
          seekJobModeExpiration: !checkUser.seekJobMode ? newDate : null,
        }
      );
      resolve({
        status: "OK",
        message: "update user seekjobmode success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const uploadfile = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      // -> Read Excel File to Json Data
      const excelData = excelToJson({
        sourceFile: path,
        sheets: [
          {
            // Excel Sheet Name
            name: "Table",

            // Header Row -> be skipped and will not be present at our result object.
            header: {
              rows: 1,
            },

            // Mapping columns to keys
            columnToKey: {
              A: "email",
              B: "phoneNumber",
              C: "MSSV",
              D: "fullName",
              E: "dateOfBirth",
              F: "gender",
              G: "industry",
              H: "currentSalary",
              I: "country",
              J: "jobTitle",
              K: "city",
              L: "district",
              M: "maritalStatusId",
              N: "yearsExperience",
              O: "currentDegree",
              P: "highestDegree",
              Q: "currentJobFunction",
              R: "currentIndustries",
              S: "skillName",
              T: "workingPreferences.companyIndustries",
              U: "password",
              A: "password",
            },
          },
        ],
      });
      User.insertMany(excelData.Table);
      fs.unlinkSync(path);
      resolve({
        status: "OK",
        message: "Create user from file success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserWorkPreferences = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const { workingPreferences } = data;
      const updateUser = await WorkingPreferences.findByIdAndUpdate(
        checkUser.workingPreferences.toString(),
        workingPreferences,
        { new: true }
      );
    } catch (e) {
      reject(e);
    }
  });
};

const createProject = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const project = await Project.create(data);
      const createProject = checkUser.projects.push(project);
      checkUser.save();
      resolve({
        status: "OK",
        message: "Project added successfully",
        data: createProject,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateProject = (userId, projectId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return resolve({ status: "ERR", message: "User not found" });
      }
      const project = await Project.findByIdAndUpdate(projectId, data);
      const projectIndex = user.projects.findIndex(
        (p) => p._id.toString() === projectId.toString()
      );

      if (projectIndex === -1) {
        return resolve({ status: "ERR", message: "Project not found" });
      }

      user.projects[projectIndex] = updateProjectData(
        user.projects[projectIndex],
        data
      );

      await user.save();
      resolve({ status: "OK", message: "Project updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

function updateProjectData(target, source) {
  for (const key in source) {
    if (key === "_id") continue;

    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = updateProjectData(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const deleteProject = (userId, projectId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const project = await Project.findByIdAndDelete(projectId);
      if (!project) {
        resolve({
          status: "ERR",
          message: "Project not found",
        });
      } else {
        const result = await User.updateOne(
          { _id: userId },
          { $pull: { projects: { _id: projectId } } }
        );
        if (result) {
          resolve({
            status: "OK",
            message: "Project deleted successfully",
          });
        } else {
          resolve({
            status: "ERR",
            message: "Project deleted failed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createWorkingHistories = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const workingHistories = await WorkingHistory.create(data);
      const createWorkingHistories =
        checkUser.workingHistories.push(workingHistories);
      checkUser.save();

      resolve({
        status: "OK",
        message: "working histories added successfully",
        data: createWorkingHistories,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateWorkingHistories = (userId, workingHistoriesId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return resolve({ status: "ERR", message: "User not found" });
      }
      const workingHistory = await WorkingHistory.findByIdAndUpdate(
        workingHistoriesId,
        data
      );
      const workingHistoryIndex = user.workingHistories.findIndex(
        (wh) => wh._id.toString() === workingHistoriesId.toString()
      );

      if (workingHistoryIndex === -1) {
        return resolve({ status: "ERR", message: "Working history not found" });
      }

      user.workingHistories[workingHistoryIndex] = updateWorkingHistoryData(
        user.workingHistories[workingHistoryIndex],
        data
      );

      await user.save();
      resolve({
        status: "OK",
        message: "Working history updated successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

function updateWorkingHistoryData(target, source) {
  for (const key in source) {
    if (key === "_id") continue;

    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = updateWorkingHistoryData(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
const deleteWorkingHistories = (userId, workingHistoriesId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const workingHistories = await WorkingHistory.findByIdAndDelete(
        workingHistoriesId
      );
      if (!workingHistories) {
        resolve({
          status: "ERR",
          message: "Working history not found",
        });
      } else {
        const result = await User.updateOne(
          { _id: userId },
          { $pull: { workingHistories: { _id: workingHistoriesId } } }
        );
        if (result) {
          resolve({
            status: "OK",
            message: "Working history deleted successfully",
          });
        } else {
          resolve({
            status: "ERR",
            message: "Working history deleted failed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createEducations = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const education = await Education.create(data);
      const createEducation = checkUser.educations.push(education);
      checkUser.save();

      resolve({
        status: "OK",
        message: "educations added successfully",
        data: createEducations,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateEducations = (userId, educationsId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return resolve({ status: "ERR", message: "User not found" });
      }
      const education = await Education.findByIdAndUpdate(educationsId, data);
      const educationIndex = user.educations.findIndex(
        (edu) => edu._id.toString() === educationsId.toString()
      );

      if (educationIndex === -1) {
        return resolve({ status: "ERR", message: "Education not found" });
      }

      user.educations[educationIndex] = updateEducationData(
        user.educations[educationIndex],
        data
      );

      await user.save();
      resolve({ status: "OK", message: "Education updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

function updateEducationData(target, source) {
  for (const key in source) {
    if (key === "_id") continue;
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = updateEducationData(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
const deleteEducations = (userId, educationsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const education = await Education.findByIdAndDelete(educationsId);
      if (!education) {
        resolve({
          status: "ERR",
          message: "Education not found",
        });
      } else {
        const result = await User.updateOne(
          { _id: userId },
          { $pull: { educations: { _id: educationsId } } }
        );
        if (result) {
          resolve({
            status: "OK",
            message: "Education deleted successfully",
          });
        } else {
          resolve({
            status: "ERR",
            message: "Education deleted failed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createCertifications = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const certification = await Certification.create(data);
      const createEducation = checkUser.certifications.push(certification);
      checkUser.save();

      resolve({
        status: "OK",
        message: "certifications added successfully",
        data: createCertifications,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateCertifications = (userId, certificationsId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return resolve({ status: "ERR", message: "User not found" });
      }
      const certification = Certification.findByIdAndUpdate(
        certificationsId,
        data
      );
      const certificationIndex = user.certifications.findIndex(
        (cert) => cert._id.toString() === certificationsId.toString()
      );

      if (certificationIndex === -1) {
        return resolve({ status: "ERR", message: "Certification not found" });
      }
      user.certifications[certificationIndex] = updateCertificationData(
        user.certifications[certificationIndex],
        data
      );

      await user.save();
      resolve({ status: "OK", message: "Certification updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

// Reusable helper function
function updateCertificationData(target, source) {
  for (const key in source) {
    if (key === "_id") continue; // Skip _id updates

    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = updateCertificationData(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
const deleteCertifications = (userId, certificationsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const certification = await Certification.findByIdAndDelete(
        certificationsId
      );
      if (!certification) {
        resolve({
          status: "ERR",
          message: "certification not found",
        });
      } else {
        const result = await User.updateOne(
          { _id: userId },
          { $pull: { certifications: { _id: certificationsId } } }
        );
        if (result) {
          resolve({
            status: "OK",
            message: "certification deleted successfully",
          });
        } else {
          resolve({
            status: "ERR",
            message: "certification deleted failed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createActivities = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const activities = await Activity.create(data);
      const createActivities = checkUser.activities.push(activities);
      checkUser.save();

      resolve({
        status: "OK",
        message: "activities added successfully",
        data: createActivities,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateActivities = (userId, activitiesId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return resolve({ status: "ERR", message: "User not found" });
      }

      const activityIndex = user.activities.findIndex(
        (act) => act._id.toString() === activitiesId.toString()
      );

      if (activityIndex === -1) {
        return resolve({ status: "ERR", message: "Activity not found" });
      }

      // Deeply update activity while preserving the _id
      user.activities[activityIndex] = updateActivityData(
        user.activities[activityIndex],
        data
      );

      await user.save();
      resolve({ status: "OK", message: "Activity updated successfully" });
    } catch (e) {
      reject(e);
    }
  });
};
function updateActivityData(target, source) {
  for (const key in source) {
    if (key === "_id") continue;

    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = updateActivityData(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
const deleteActivities = (userId, activitiesId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const activities = await Education.findByIdAndDelete(activitiesId);
      if (!activities) {
        resolve({
          status: "ERR",
          message: "Education not found",
        });
      } else {
        const result = await User.updateOne(
          { _id: userId },
          { $pull: { activities: { _id: activitiesId } } }
        );
        if (result) {
          resolve({
            status: "OK",
            message: "Education deleted successfully",
          });
        } else {
          resolve({
            status: "ERR",
            message: "Education deleted failed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createLanguage = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const language = await User.findOne({
        "languageSkills.nameLanguage": data.nameLanguage,
      });
      if (language) {
        resolve({
          status: "ERR",
          message: "language is exist",
        });
      } else {
        const createLanguage = await User.updateOne(
          { _id: userId },
          { $push: { languageSkills: data } }
        )
          .then((result) => {
            // console.log("language added successfully:", result);
          })
          .catch((error) => {
            // console.error("Error adding language:", error);
            resolve({
              status: "ERR",
              message: "language added error",
              data: createLanguage,
            });
          });
        resolve({
          status: "OK",
          message: "language added successfully",
          data: createLanguage,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateLanguage = (userId, languageId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const language = await User.findOne({ "languageSkills._id": languageId });
      const languageByName = await User.findOne({
        "languageSkills.nameLanguage": data.nameLanguage,
      });
      let checkLanguage = 0;
      languageByName?.languageSkills.map((item) => {
        if (
          item._id.toHexString() !== languageId &&
          item.nameLanguage === data.nameLanguage
        ) {
          checkLanguage = 1;
        }
      });
      if (!language) {
        resolve({
          status: "ERR",
          message: "language not found",
        });
      } else if (checkLanguage === 1) {
        resolve({
          status: "ERR",
          message: "language is exist",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { languageSkills: { _id: languageId } } },
          { new: true }
        );
        await User.updateOne(
          { _id: userId },
          { $push: { languageSkills: data } }
        )
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "language update error",
            });
          });
        resolve({
          status: "OK",
          message: "language update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const deleteLanguage = (userId, languageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const language = await User.findOne({ "languageSkills._id": languageId });
      if (!language) {
        resolve({
          status: "ERR",
          message: "language not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { languageSkills: { _id: languageId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "language deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createSkills = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const createSkills = await User.updateOne(
        { _id: userId },
        { $push: { skills: data } }
      )
        .then((result) => {
          // console.log("language added successfully:", result);
        })
        .catch((error) => {
          // console.error("Error adding language:", error);
          resolve({
            status: "ERR",
            message: "skills added error",
            data: createSkills,
          });
        });
      resolve({
        status: "OK",
        message: "skills added successfully",
        data: createSkills,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateSkills = (userId, skillsId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const skills = await User.findOne({ "skills._id": skillsId });
      if (!skills) {
        resolve({
          status: "ERR",
          message: "skills not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { skills: { _id: skillsId } } },
          { new: true }
        );
        await User.updateOne({ _id: userId }, { $push: { skills: data } })
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "skills update error",
            });
          });
        resolve({
          status: "OK",
          message: "skills update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const deleteSkills = (userId, skillsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const language = await User.findOne({ "skills._id": skillsId });
      if (!language) {
        resolve({
          status: "ERR",
          message: "skills not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { skills: { _id: skillsId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "skills deleted successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateIntroduce = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById({
        _id: userId,
      });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { introduce: data } },
        { new: true }
      );
      resolve({
        status: "OK",
        message: "update introduce successfully",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
  changePassword,
  updateSeekJob,
  uploadfile,
  updateUserWorkPreferences,
  createProject,
  updateProject,
  deleteProject,
  createWorkingHistories,
  updateWorkingHistories,
  deleteWorkingHistories,
  createEducations,
  updateEducations,
  deleteEducations,
  createCertifications,
  updateCertifications,
  deleteCertifications,
  createActivities,
  updateActivities,
  deleteActivities,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  createSkills,
  updateSkills,
  deleteSkills,
  updateIntroduce,
};
