const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
    </div>`
    attachImage.push({ path: order.image })
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Title", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>message</b></div> ${listItem}`,
    attachments: attachImage,
  });
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: {
      name: 'Ctu-works',
      address: process.env.MAIL_ACCOUNT,
    },
    to: "chuongvo900@gmail.com",
    subject: 'Xác thực email trên CtuWorks',
    html: `
      <div style="background-color: #E6EFFF">
        <img style="margin: 0 0 10px 33%;" src="https://upload.wikimedia.org/wikipedia/en/6/6e/Can_Tho_University_Logo.png" />
        <div style="background-color: white; width: 600px; margin: 0 230px 30px 230px; padding: 20px 30px">
          <h1 style="text-align: center">Xác thực email trên CtuWorks</h1>
          <p>Xin chào,</p>
          <p>Cám ơn bạn đã đăng ký thành viên trên VietnamWorks.
            Hãy bấm vào nút bên dưới để xác thực email ${email}.
            Email này sẽ không thể sử dụng cho trang Nhà tuyển dụng.</p>
          <a href="${verificationLink}" style="padding: 10px 20px; margin-left: 35%;
          background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Xác thực tài khoản</a>
          <p>Tại sao chúng tôi lại làm việc này: Bằng việc xác thực email,
            bạn xác nhận rằng bạn muốn đăng ký trở thành người dùng của trang CtuWorks Tìm việc.</p>
          <p>Nếu cần hỗ trợ, hãy liên hệ: contact@ctuworks.com</p>
          <p>Cám ơn và chúc bạn một ngày tốt lành.</p>
          <h4>CtuWorks<h4>
        </div>
        <div>.</div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions);
};


module.exports = {
  sendEmailCreateOrder,
  sendVerificationEmail
}