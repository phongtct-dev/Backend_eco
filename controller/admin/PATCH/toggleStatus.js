const adminServices = require("../../../services/adminServices");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");



module.exports = catchAsync( async(req,res , next) => {
    const user = await adminServices.toggleUserStatus(req.params.id);
    const message = user.isActive ? "Da MO Kho tai khoan" : "Da KHOA tai khoan";

    sendResponse(res,200, message, user);
})