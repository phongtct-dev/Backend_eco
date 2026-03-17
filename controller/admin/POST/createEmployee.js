const adminServices = require("../../../services/adminServices");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");



module.exports = catchAsync(async(req, res , next) => {
    const newEmployee = await adminServices.createEmployee(req.body);
    sendResponse(res,201, "Tao tai khoan Cho Nhan Vien Thanh Cong", newEmployee)
});