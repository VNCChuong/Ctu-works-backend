const Apply = require("../models/ApplyModel");
const Notification = require("../models/NotificationModel");
const JobPost = require("../models/JobPostModel");

const createNotification = async (applyId, io) => {
  try {
    const apply = await Apply.findById(applyId).populate({
      path: "jobPostId",
      populate: {
        path: "jobInfoId",
        model: "JobInfo",
      },
    });

    if (!apply) {
      console.error(`Apply với ID ${applyId} không được tìm thấy`);
      return null;
    }

    const existingNotification = await Notification.findOne({
      UserId: apply.userId,
      message: `Nhà tuyển dụng đã xem đơn ứng tuyển của bạn cho công việc ${apply.jobPostId.jobInfoId.jobTitle}.`,
      isRead: false,
    });

    if (existingNotification) {
      console.log("Thông báo tương tự đã tồn tại.");
      return existingNotification;
    }

    const notification = new Notification({
      UserId: apply.userId,
      message: `Nhà tuyển dụng đã xem đơn ứng tuyển của bạn cho công việc ${apply.jobPostId.jobInfoId.jobTitle}.`,
      isRead: false,
    });

    await notification.save();
    io.emit(`notification-${apply.userId}`, notification);
    return notification;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
    throw new Error("Không thể tạo thông báo");
  }
};

const notifyRecruiterOnApply = async (applyId, io) => {
  try {
    const apply = await Apply.findById(applyId).populate({
      path: "jobPostId",
      populate: {
        path: "jobInfoId",
        model: "JobInfo",
      },
    });

    if (!apply) {
      console.error(`Apply với ID ${applyId} không được tìm thấy`);
      return null;
    }

    // const message = `Người dùng ${apply.userId} đã ứng tuyển vào công việc ${apply.jobPostId.title}.`;

    const existingNotification = await Notification.findOne({
      UserId: apply.userId,
      message: `Người dùng ${apply.userId} đã ứng tuyển vào công việc ${apply.jobPostId.jobInfoId.jobTitle}.`,
      isRead: false,
    });

    if (existingNotification) {
      console.log("Thông báo tương tự đã tồn tại.");
      return existingNotification;
    }

    // const notification = new Notification({
    //   UserId: apply.recruiterId, // Gửi thông báo đến nhà tuyển dụng
    //   message,
    //   isRead: false,
    // });

    const notification = new Notification({
      UserId: apply.recruiterId,
      message: `Người dùng ${apply.userId} đã ứng tuyển vào công việc ${apply.jobPostId.jobInfoId.jobTitle}.`,
      isRead: false,
    });

    // await notification.save();

    // // Phát thông báo real-time cho nhà tuyển dụng
    // io.emit(`notification-${apply.recruiterId}`, notification);

    // return notification;

    await notification.save();
    io.emit(`notification-${apply.recruiterId}`, notification);
    return notification;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo cho nhà tuyển dụng:", error);
    throw new Error("Không thể tạo thông báo.");
  }
};

const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ UserId: userId }).sort({
      createdAt: -1,
    });
    return notifications;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    throw new Error("Không thể lấy thông báo.");
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      console.error("Thông báo không tồn tại.");
      return null;
    }

    return updatedNotification;
  } catch (error) {
    console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
    throw new Error("Không thể cập nhật thông báo.");
  }
};

const countUnreadNotifications = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      UserId: userId,
      isRead: false,
    });
    return count;
  } catch (error) {
    console.error("Lỗi khi đếm số lượng thông báo chưa đọc:", error);
    throw new Error("Không thể đếm thông báo chưa đọc.");
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  countUnreadNotifications,
  notifyRecruiterOnApply,
};
