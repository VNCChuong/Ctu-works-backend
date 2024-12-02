const searchService = require("../services/SearchService");

const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      jobLevel,
      location,
      companyName,
      jobType,
      minSalary,
      maxSalary,
    } = req.query;
    console.log(req.query);
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        status: "ERR",
        message: "Keyword is required",
      });
    }

    const filters = {
      keyword: keyword.trim(),
      jobLevel: jobLevel ? jobLevel.trim() : null,
      location: location ? location.trim() : null,
      companyName: companyName ? companyName.trim() : null,
      jobType: jobType ? jobType.trim() : null,
      minSalary: minSalary ? minSalary.trim() : null,
      maxSalary: maxSalary ? maxSalary.trim() : null,
    };
    console.log(filters);
    const result = await searchService.searchJobs(filters);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal server error",
    });
  }
};

module.exports = {
  searchJobs,
};
