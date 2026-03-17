const User = require("../models/userModel");



exports.updateProfile = async (userId, updateData) => {
    // Chỉ lấy các trường được phép sửa
    const filteredData = {};
    const allowedFields = ['fullName', 'phone', 'address', 'avatar'];
    
    Object.keys(updateData).forEach(el => {
        if (allowedFields.includes(el)) filteredData[el] = updateData[el];
    });

    const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
        new: true, // Trả về object sau khi đã update
        runValidators: true // Chạy kiểm tra ràng buộc của Mongoose
    });

    return updatedUser;
};