const { acceptCodeSchema } = require("../../../validators/authValidator");
const authService = require("../../../services/authServices");
const catchAsync = require("../../../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
  // 1 kiem tra dau vao
  const { error } = acceptCodeSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const { email, providedCode } = req.body;

  // goi Service xử lý

  await authService.verifyVerificationCode(email, providedCode);

  //
  res.status(200).json({
    success: true,
    message: "Tai khoan da duoc xac thuc thanh cong",
  });
});
