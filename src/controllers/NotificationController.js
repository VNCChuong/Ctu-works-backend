const NotificationService = require("../services/notificationService");

const sendNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await NotificationService.createNotification(id);

    if (!result) {
      return res.status(404).send({ message: "Apply not found." });
    }

    res.status(200).send({ message: "Notification sent successfully." });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send({ message: "Internal Server Error." });
  }
};

module.exports = { sendNotification };
