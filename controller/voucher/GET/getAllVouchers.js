const Voucher = require("../../../models/voucherModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Voucher.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const vouchers = await features.query;

  sendResponse(res, 200, "Lấy danh sách voucher thành công", {
    results: vouchers.length,
    data: vouchers
  });
});