const Company = require("../models/CompanyModel");

const getTopCompaniesByFollowing = (limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const topCompanies = await Company.find()
        .sort({ following: -1 })
        .limit(limit);

      resolve({
        status: "OK",
        message: "Success",
        data: topCompanies,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Failed to fetch top companies by following",
        error: error.message,
      });
    }
  });
};

module.exports = {
  getTopCompaniesByFollowing,
};
