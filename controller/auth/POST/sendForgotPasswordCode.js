
const authService = require("../../../services/authServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");

module.exports = catchAsync ( async (req, res , next) => {
    await authService.sendForgotPasswordCode(req.body.email)

    res .status(200)
        .json({
            success: true,
            message:'Ma khoi phuc da gui ve email'
        })
})