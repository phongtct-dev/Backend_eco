const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { signupSchema } = require("../../../validators/authValidator");
const authService = require("../../../services/authServices");

module.exports = catchAsync(async (req, res, next) => {
  //1 Validation
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  //Goi Service xu li logic
  const result = await authService.signup(req.body);

  // phan hoi thanh cong
  res.status(201).json({
    success: true,
    message: "Tai khoan cua ban da duoc tao thanh cong",
    data: result,
  });
});
