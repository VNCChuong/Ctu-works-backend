const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/UserModel");
const JobPost = require("../models/JobPostModel");
const Recruiter = require("../models/RecruiterModel");
const SendInvite = require("../models/SendInviteModel");
const sendInvitationEmail = async (email, jobDetails, recruiterName) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Ctu-works",
      address: process.env.MAIL_ACCOUNT,
    },
    to: email,
    subject: "Lời mời tuyển dụng từ CtuWorks",
    html: `
            <div style="background-color: #E6EFFF">
                <img style="margin: 0 0 10px 33%;" src="https://upload.wikimedia.org/wikipedia/en/6/6e/Can_Tho_University_Logo.png" />
                <div style="background-color: white; width: 600px; margin: 0 230px 30px 230px; padding: 20px 30px">
                    <h1 style="text-align: center">Lời mời tuyển dụng từ nhà tuyển dụng</h1>
                    <p>Xin chào,</p>
                    <p>Bạn đã nhận được lời mời tuyển dụng cho vị trí <b>${jobDetails.jobTitle}</b> tại công ty <b>${jobDetails.companyName}</b>.</p>
                    <p>Chi tiết công việc:</p>
                    <p>${jobDetails.jobDescription}</p>
                    <p>Hãy bấm vào nút bên dưới để xem chi tiết và ứng tuyển.</p>
                    <a href="${jobDetails.link}" style="padding: 10px 20px; margin-left: 35%;
                    background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Xem chi tiết</a>
                    <p>Nếu cần hỗ trợ, hãy liên hệ: contact@ctuworks.com</p>
                    <p>Cám ơn và chúc bạn một ngày tốt lành.</p>
                    <h4>CtuWorks<h4>
                </div>
                <div>.</div>
            </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

const sendJobInvitation = async (recruiterId, userId, jobId) => {
  try {
    const user = await User.findById(userId);
    const job = await JobPost.findById(jobId)
      .populate("jobInfoId")
      .populate("jobCompanyInfoId");
    const recruiter = await Recruiter.findById(recruiterId);

    if (!user || !job || !recruiter) {
      throw new Error("User, Job, or Recruiter not found");
    }

    const jobDetails = {
      jobTitle: job.jobInfoId.jobTitle,
      companyName: job.jobCompanyInfoId.companyName,
      jobDescription: job.jobInfoId.jobDescription,
      link: `${process.env.APP_URL}/job/${job._id}`,
    };

    // console.log(jobDetails.link);
    await sendInvitationEmail("chuongvo900@gmail.com", jobDetails, recruiter.fullName);
    await SendInvite.create({
      userId: userId,
      jobPostId: jobId,
      recruiterId: recruiterId,
    });
    return {
      status: "OK",
      message: "Invitation sent successfully",
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getAllInvitations = async (id) => {
  try {
    const invitations = await SendInvite.find({ recruiterId: id })

    return {
      status: "OK",
      message: "Invitations retrieved successfully",
      data: invitations,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const getInvitationDetails = async (id) => {
  // Logic để lấy chi tiết lời mời theo id
};

const deleteInvitation = async (id) => {
  // Logic để xóa lời mời theo id
};

module.exports = {
  sendJobInvitation,
  getAllInvitations,
  getInvitationDetails,
  deleteInvitation,
};
