const { updateProfileSchema } = require("../../../validators/profileValidator");
const profileServices = require("../../../services/profileServices");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { uploadImage } = require("../../../utils/cloudinary");


module.exports = catchAsync(async (req, res, next) => {
    const dataToValidate = { ...req.body };
    if (req.file) delete dataToValidate.avatar; 

    const { error } = updateProfileSchema.validate(dataToValidate);
    if (error) return next(new AppError(error.details[0].message, 400));

    // 2. Nếu có file (Profile dùng MemoryStorage nên dùng .buffer)
    if (req.file) {
        const result = await uploadImage(req.file.buffer, "avatars");
        req.body.avatar = result.url; 
    }

    const updatedUser = await profileServices.updateProfile(req.user._id, req.body);

    res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: updatedUser
    });
});