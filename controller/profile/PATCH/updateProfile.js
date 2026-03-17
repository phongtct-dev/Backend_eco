const  {updateProfileSchema}  = require("../../../validators/profileValidator");
const profileServices = require ("../../../services/profileServices")
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");



module.exports = catchAsync(async (req, res, next) => {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const updatedUser = await profileServices.updateProfile(req.user._id, req.body);

    res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: updatedUser
    });
});