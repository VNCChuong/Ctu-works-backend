const Apply = require("../models/apply");
const Notification = require("../models/notification");

const createNotification = async (applyId) => {
  try {
    const apply = await Apply.findById(applyId).populate("userId jobPostId");

    if (!apply) return null;

    const notification = new Notification({
      UserId: apply.userId._id,
      message: `Đơn apply của bạn cho công việc ${apply.jobPostId} đã được xem.`,
      isRead: false,
    });

    await notification.save();
    return notification;
  } catch (error) {
    throw new Error("Failed to create notification");
  }
};

module.exports = { createNotification };
