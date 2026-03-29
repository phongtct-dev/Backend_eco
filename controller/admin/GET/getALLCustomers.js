const adminServices = require("../../../services/adminServices");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");
const User = require('../../../models/userModel');

module.exports = catchAsync(async(req, res, next) => {
    const role = req.query.role || "staff";
    
    // 1. ĐẾM TỔNG SỐ LƯỢNG (Bỏ qua paginate)
    const countFeatures = new APIFeatures(User.find({isDeleted: false, role: role}), req.query)
        .search()
        .filter();
    const total = await countFeatures.query.countDocuments();

    // 2. LẤY DỮ LIỆU CỦA TRANG HIỆN TẠI
    const features = new APIFeatures(User.find({isDeleted: false, role: role}), req.query)
        .search()
        .filter()
        .sort()
        .paginate();

    const users = await features.query;

    // 3. TRẢ VỀ THÊM BIẾN "total" CHO FRONTEND
    sendResponse(res, 200, `Lay danh sach ${role} thanh cong`, {
        total: total, // Dòng này là "chìa khóa" phân trang
        result: users.length,
        data: users
    });
});