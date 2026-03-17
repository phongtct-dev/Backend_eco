const orderServices = require('../../../services/orderServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');
const Order = require("../../../models/orderModel");
const APIFeatures = require("../../../utils/apiFeatures");






module.exports = catchAsync(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) throw new AppError("Không tìm thấy đơn hàng", 404);

  order.status = status;
  order.statusHistory.push({
    status,
    note,
    updatedBy: req.user._id
  });

  await order.save();
  sendResponse(res, 200, `Đã chuyển trạng thái sang ${status}`, order);
});