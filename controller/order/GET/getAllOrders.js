const orderServices = require('../../../services/orderServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');
const Order = require("../../../models/orderModel");
const APIFeatures = require("../../../utils/apiFeatures");



module.exports = catchAsync(async (req, res) => {
  const features = new APIFeatures(Order.find().populate("user", "fullName email"), req.query)
    .filter()
    .sort()
    .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments();

  sendResponse(res, 200, "Lấy tất cả đơn hàng thành công", {
    results: orders.length,
    total,
    orders
  });
});
