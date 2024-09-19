const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const { sendVerificationEmail } = require("./EmailService");
const crypto = require("crypto");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");

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
      // locations, jobFunction, companyIndustries, salary, desiredJobLevel,
      confirmPassword,
      MSSV,
    } = newUser;
    // console.log(newUser)
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
      const checkPhone = await User.findOne({
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
      const createdUser = await User.create({
        fullName,
        phoneNumber,
        email,
        password: hash,
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
        //     locations, jobFunction, companyIndustries, salary, desiredJobLevel,
        // },
        MSSV,
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
      // console.log(e)
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
      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
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

const getAllUser = (page = 1, pagesize = 5) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * pagesize;

      const allUser = await User.find()
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(pagesize);
      resolve({
        status: "OK",
        message: "Success",
        data: allUser,
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
        data: user,
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
      const updateUser = await User.findByIdAndUpdate(userId, data, {
        new: true,
      });
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
      const createProject = await User.updateOne(
        { _id: userId },
        { $push: { project: data } }
      )
        .then((result) => {
          // console.log("Project added successfully:", result);
        })
        .catch((error) => {
          // console.error("Error adding project:", error);
          resolve({
            status: "ERR",
            message: "Project added error",
            data: createProject,
          });
        });
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
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const project = await User.findOne({ "project._id": projectId });
      if (!project) {
        resolve({
          status: "ERR",
          message: "Project not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { project: { _id: projectId } } },
          { new: true }
        );
        await User.updateOne({ _id: userId }, { $push: { project: data } })
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "Project update error",
            });
          });
        resolve({
          status: "OK",
          message: "Project update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
      const project = await User.findOne({ "project._id": projectId });
      if (!project) {
        resolve({
          status: "ERR",
          message: "Project not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { project: { _id: projectId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "Project deleted successfully",
        });
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
      const createWorkingHistories = await User.updateOne(
        { _id: userId },
        { $push: { workingHistories: data } }
      )
        .then((result) => {
          // console.log("workingHistories added successfully:", result);
        })
        .catch((error) => {
          // console.error("Error adding workingHistories:", error);
          resolve({
            status: "ERR",
            message: "working histories added error",
            data: createWorkingHistories,
          });
        });
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
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const workingHistories = await User.findOne({
        "workingHistories._id": workingHistoriesId,
      });
      if (!workingHistories) {
        resolve({
          status: "ERR",
          message: "working histories not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { workingHistories: { _id: workingHistoriesId } } },
          { new: true }
        );
        await User.updateOne(
          { _id: userId },
          { $push: { workingHistories: data } }
        )
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "working histories update error",
            });
          });
        resolve({
          status: "OK",
          message: "working histories update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
      const workingHistories = await User.findOne({
        "workingHistories._id": workingHistoriesId,
      });
      if (!workingHistories) {
        resolve({
          status: "ERR",
          message: "working histories not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { workingHistories: { _id: workingHistoriesId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "working histories deleted successfully",
        });
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
      const createEducations = await User.updateOne(
        { _id: userId },
        { $push: { educations: data } }
      )
        .then((result) => {
          // console.log("Educations added successfully:", result);
        })
        .catch((error) => {
          // console.error("Error adding educations:", error);
          resolve({
            status: "ERR",
            message: "educations added error",
            data: createEducations,
          });
        });
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
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const educations = await User.findOne({ "educations._id": educationsId });
      if (!educations) {
        resolve({
          status: "ERR",
          message: "educations not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { educations: { _id: educationsId } } },
          { new: true }
        );
        await User.updateOne({ _id: userId }, { $push: { educations: data } })
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "educations update error",
            });
          });
        resolve({
          status: "OK",
          message: "educations update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
      const educations = await User.findOne({ "educations._id": educationsId });
      if (!educations) {
        resolve({
          status: "ERR",
          message: "educations not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { educations: { _id: educationsId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "educations deleted successfully",
        });
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
      const createCertifications = await User.updateOne(
        { _id: userId },
        { $push: { certifications: data } }
      )
        .then((result) => {
          // console.log("certifications added successfully:", result);
        })
        .catch((error) => {
          // console.error("Error adding certifications:", error);
          resolve({
            status: "ERR",
            message: "certifications added error",
            data: createCertifications,
          });
        });
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
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const certifications = await User.findOne({
        "certifications._id": certificationsId,
      });
      if (!certifications) {
        resolve({
          status: "ERR",
          message: "certifications not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { certifications: { _id: certificationsId } } },
          { new: true }
        );
        await User.updateOne(
          { _id: userId },
          { $push: { certifications: data } }
        )
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "certifications update error",
            });
          });
        resolve({
          status: "OK",
          message: "certifications update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
      const certifications = await User.findOne({
        "certifications._id": certificationsId,
      });
      if (!certifications) {
        resolve({
          status: "ERR",
          message: "certifications not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { certifications: { _id: certificationsId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "certifications deleted successfully",
        });
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
      const createActivities = await User.updateOne(
        { _id: userId },
        { $push: { activities: data } }
      )
        .then((result) => {
          // console.log("activities added successfully:", result);
        })
        .catch((error) => {
          // console.error("Error adding activities:", error);
          resolve({
            status: "ERR",
            message: "activities added error",
            data: createActivities,
          });
        });
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
      const checkUser = await User.findById({
        _id: userId,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const activities = await User.findOne({ "activities._id": activitiesId });
      if (!activities) {
        resolve({
          status: "ERR",
          message: "activities not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { activities: { _id: activitiesId } } },
          { new: true }
        );
        await User.updateOne({ _id: userId }, { $push: { activities: data } })
          .then((result) => {
            // console.log("Project update successfully:", result);
          })
          .catch((error) => {
            // console.error("Error update project:", error);
            resolve({
              status: "ERR",
              message: "activities update error",
            });
          });
        resolve({
          status: "OK",
          message: "activities update successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

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
      const activities = await User.findOne({ "activities._id": activitiesId });
      if (!activities) {
        resolve({
          status: "ERR",
          message: "activities not found",
        });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { activities: { _id: activitiesId } } },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "activities deleted successfully",
        });
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
