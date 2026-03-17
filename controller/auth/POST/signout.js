const authService = require("../../../services/authServices");
const catchAsync = require("../../../utils/catchAsync");


module.exports = catchAsync (async (req, res, next) => {
  const result = await authService.signout();

  res .clearCookie("Authorization")
        .clearCookie("refreshToken")
        .status(result.status)
        .json(result);

    
});



