const Voucher = require("../../../models/voucherModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  // 1. THÊM ĐOẠN NÀY: Đếm tổng số voucher trong Database
  const countFeatures = new APIFeatures(Voucher.find(), req.query).filter();
  const total = await countFeatures.query.countDocuments();

  // 2. GIỮ NGUYÊN ĐOẠN NÀY: Lấy dữ liệu của trang hiện tại
  const features = new APIFeatures(Voucher.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const vouchers = await features.query;

  // 3. NHÉT BIẾN TOTAL VÀO RESPONSE
  sendResponse(res, 200, "Lấy danh sách voucher thành công", {
    total: total, // <-- BIẾN NÀY QUYẾT ĐỊNH PHÂN TRANG
    results: vouchers.length,
    data: vouchers
  });
});