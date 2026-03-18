
const authService = require("../../../services/authServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");



module.exports = catchAsync(async (req, res, next) => {
    // Lấy refreshToken từ cookie hoặc body
    const refreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken;

    if (!refreshToken) {
    return next(new AppError("Khong co refresh token", 403));
  }

     const result = await authService.refreshToken(refreshToken);;

     if (!result.success) {
    return next(new AppError(result.message, result.status));
  }

    return res
        .cookie("Authorization", "Bearer " + result.accessToken, {
          expires: new Date(Date.now() + 8 * 3600000),
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        })
        .status(result.status)
        .json(result);
    
});
