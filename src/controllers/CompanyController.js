const CompanyService = require("../services/CompanyService");

const getTopCompanies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await CompanyService.getTopCompaniesByFollowing(limit);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  getTopCompanies,
};
