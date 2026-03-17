const inventoryServices = require("../../../services/inventoryServices");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  const stats = await inventoryServices.getInventoryStats();

  sendResponse(res, 200, "Thống kê kho hàng thành công", stats);
});