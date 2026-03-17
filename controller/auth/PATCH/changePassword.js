const authService = require("../../../services/authServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { changePasswordSchema } = require("../../../validators/authValidator");

module.exports = catchAsync (async (req , res , next) => {

    const {error} = changePasswordSchema.validate(req.body);

     if (error) {
      return next(new AppError(error.details[0].message, 401));
    }

    const { _id, verified } = req.user;
    const {oldPassword , newPassword} = req.body;
    
    if(!verified){
        return next(new AppError("tai khoan chua duoc xac thuc",401 ))
    }

    await authService.changePassword(_id,oldPassword,newPassword);

    res .status(200)
        .json({
            success: true,
            message: "Thay doi mat khau Thanh Cong"
        });
})