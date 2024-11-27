const SendInviteService = require("../services/SendInviteService");

const sendInvitation = async (req, res) => {
  try {
    const { recruiterId, userId, jobId } = req.body;
    if (!recruiterId || !userId || !jobId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await SendInviteService.sendJobInvitation(
      recruiterId,
      userId,
      jobId
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

const getAllInvitation = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    if (!recruiterId) {
      return res.status(200).json({
        status: "ERR",
        message: "The recruiterId is required",
      });
    }
    const response = await SendInviteService.getAllInvitations(recruiterId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};
module.exports = {
  sendInvitation,
  getAllInvitation
};
