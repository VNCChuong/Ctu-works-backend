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
    to: email,
    subject: 'Xác nhận đăng ký tài khoản',
    html: `
      <h1>Xác nhận đăng ký tài khoản</h1>
      <p>Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn:</p>
      <a href="${verificationLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Xác nhận</a>
      <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    `,
  };

  transporter.sendMail(mailOptions);
};


module.exports = {
  sendEmailCreateOrder,
  sendVerificationEmail
}