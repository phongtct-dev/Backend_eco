const authService = require("../../../services/authServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { acceptFPCodeSchema } = require("../../../validators/authValidator");


module.exports = catchAsync( async (req , res , next) => {

    const {email , providedCode, newPassword} = req.body;

     const { error } = acceptFPCodeSchema.validate({ email,newPassword,providedCode  });
    
        if (error) {
          return next(new AppError(error.details[0].message, 401));
        }
    

    await authService.forgotPasswordCode(email,providedCode,newPassword)

    res .status(200)
        .json({
            success: true,
            message: "Mat Khau da duoc thay doi Thanh cong"
        })
    



})
