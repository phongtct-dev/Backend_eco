const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

const voucherServices = require('../../../services/voucherServices');




// Admin: Tạo
module.exports = catchAsync(async (req, res) => {
  const voucher = await voucherServices.createVoucher(req.body);
  sendResponse(res, 201, "Tạo voucher thành công", voucher);
});