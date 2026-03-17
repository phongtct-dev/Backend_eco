const orderServices = require('../../../services/orderServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');
const Order = require("../../../models/orderModel");
const APIFeatures = require("../../../utils/apiFeatures");







module.exports = catchAsync(async (req, res) => {
  const result = await orderServices.checkout(req.user._id, req.body, req.user.email);
  sendResponse(res, 201, "Thành công", result);
});


