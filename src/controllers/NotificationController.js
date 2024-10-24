const NotificationService = require("../services/NotificationService");

const sendNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.createNotification(
      id,
      req.app.get("io")
    );
    if (!notification) {
      return res.status(404).json({ message: "Apply không được tìm thấy" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
    res.status(500).json({ message: "Không thể tạo thông báo" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await NotificationService.getUserNotifications(
      userId
    );
    res.status(200).json({ status: "OK", data: notifications });
  } catch (error) {
    res.status(500).json({ status: "ERR", message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationService.markNotificationAsRead(
      notificationId
    );
    if (!notification) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Thông báo không tồn tại." });
    }
    res.status(200).json({ status: "OK", data: notification });
  } catch (error) {
    res.status(500).json({ status: "ERR", message: error.message });
  }
};

const countUnread = async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await NotificationService.countUnreadNotifications(userId);
    res.status(200).json({ status: "OK", data: { unreadCount: count } });
  } catch (error) {
    res.status(500).json({ status: "ERR", message: error.message });
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  countUnread,
};
