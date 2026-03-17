const revenueServices = require("../../../services/revenueServices");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  // Nhận các tham số như ?year=2026 hoặc ?startDate=...&endDate=...
  const stats = await revenueServices.getRevenueStats(req.query);

  sendResponse(res, 200, "Lấy báo cáo doanh thu thành công", stats);
});