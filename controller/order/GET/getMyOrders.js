const orderServices = require('../../../services/orderServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');
const Order = require("../../../models/orderModel");
const APIFeatures = require("../../../utils/apiFeatures");




module.exports = catchAsync(async (req, res) => {
  const features = new APIFeatures(Order.find({ user: req.user._id }), req.query)
    .filter()
    .sort()
    .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments({ user: req.user._id });

  sendResponse(res, 200, "Lấy danh sách đơn hàng thành công", {
    results: orders.length,
    total,
    orders
  });
});