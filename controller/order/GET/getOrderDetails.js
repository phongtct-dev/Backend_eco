const orderServices = require('../../../services/orderServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');
const Order = require("../../../models/orderModel");
const APIFeatures = require("../../../utils/apiFeatures");





module.exports = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product user");
  if (!order) throw new AppError("Không tìm thấy đơn hàng", 404);
  
  sendResponse(res, 200, "Thành công", order);
});