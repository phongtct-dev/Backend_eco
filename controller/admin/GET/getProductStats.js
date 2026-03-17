const inventoryServices = require("../../../services/inventoryServices");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  // Lấy limit từ query, mặc định là 10
  const limit = req.query.limit || 10;
  
  const stats = await inventoryServices.getProductPerformStats(limit);

  sendResponse(res, 200, `Thống kê Top ${limit} sản phẩm thành công`, stats);
});