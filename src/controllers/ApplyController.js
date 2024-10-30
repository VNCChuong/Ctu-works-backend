const ApplyService = require("../services/ApplyService");
const NotificationService = require("../services/NotificationService");

const createApply = async (req, res) => {
  try {
    const { jobPostId, recruiterId } = req.body;
    const io = req.app.get("io"); // Lấy đối tượng io từ app

    if (!io) {
      return res.status(500).json({
        status: "ERR",
        message: "Socket.IO instance is not available",
      });
    }

    if (!jobPostId || !recruiterId) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await ApplyService.createApply(
      req.body,
      req.app.get("io")
    );

    // if (response.status === "OK" && response.data) {
    //   await NotificationService.notifyRecruiterOnApply(response.data._id, io); // Truyền io vào service
    // }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi khi tạo apply:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Không thể tạo đơn ứng tuyển",
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

const getApplyCountByJob = async (req, res) => {
  try {
    const { jobPostId } = req.params;

    if (!jobPostId) {
      return res.status(200).json({
        status: "ERR",
        message: "The jobPostId is required",
      });
    }

    const response = await ApplyService.getApplyCountByJob(jobPostId);
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
  getApplyCountByJob,
};
