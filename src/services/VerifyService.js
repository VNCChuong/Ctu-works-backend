const User = require("../models/UserModel")
const { StatusCodes } = require('http-status-codes');

const VerifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        // Tìm người dùng với mã xác thực này
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid verification link.' });
        }

        // Xác thực thành công
        user.isVerified = true;
        user.verificationToken = null; // Xóa mã xác thực sau khi đã xác thực thành công
        await user.save();

        res.status(StatusCodes.OK).json({ message: 'Email verified successfully.' });

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error verifying email.' });
    }
};



module.exports = {
    VerifyEmail
}