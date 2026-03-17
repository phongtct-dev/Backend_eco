
const authService = require("../../../services/authServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");


module.exports = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError("Vui lòng cung cấp Email!", 400));
    }

    await authService.sendVerificationCode(email);

    res.status(200).json({
        success: true,
        message: "Mã xác minh đã được gửi vào Email của bạn!"
    });
});