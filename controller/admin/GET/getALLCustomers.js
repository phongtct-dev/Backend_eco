
const adminServices = require("../../../services/adminServices");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");
const User = require('../../../models/userModel')


module.exports = catchAsync(async(req, res, next) => {
    
     const role = req.query.role || "staff" ;
    
    const features = new APIFeatures(User.find({isDeleted: false,role: role}), req.query)
        .search()
        .filter()
        .sort()
        .paginate();

    const users = await features.query;

    sendResponse(res, 200, `Lay danh sach ${role} thanh cong`,{
        result: users.length,
        data: users
    });
})