const { signinSchema } = require("../../../validators/authValidator");
const authService = require("../../../services/authServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");


module.exports = catchAsync(async (req, res, next) => {
  

    const { email, password } = req.body;
    const { error } = signinSchema.validate({ email, password });

    if (error) {
      return next(new AppError(error.details[0].message, 401));
    }

    const result = await authService.signin(req.body);

    //Set cookie
   return res
      .cookie("Authorization", "Bearer " + result.token, {
        expires: new Date(Date.now() + 8 * 3600000), //8h
        httpOnly: process.env.NODE_ENV === "production", //chỉ đọc từ server (httpOnly) HTTPS (secure) khi ở production
        secure: process.env.NODE_ENV === "production", //chỉ gửi quagửi qua HTTPS (secure) khi ở production
      })

      .cookie("refreshToken", result.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .status(result.status)
      .json(result);
}) 