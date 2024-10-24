const ApplyService = require("../services/ApplyService");

const createApply = async (req, res) => {
  try {
    const { jobPostId, recruiterId } = req.body;
    if (!jobPostId || !recruiterId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ApplyService.createApply(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateApply = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ApplyService.updateApply(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteApply = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The id is required",
      });
    }
    const response = await ApplyService.deleteApply(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getMyApply = async (req, res) => {
  try {
    const id = req.params.id;
    const { jobpostId } = req.body;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The id is required",
      });
    }
    const response = await ApplyService.getMyApply(id, jobpostId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createApply,
  updateApply,
  deleteApply,
  getMyApply,
};
