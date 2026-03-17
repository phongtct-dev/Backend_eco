const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

const voucherServices = require('../../../services/voucherServices');



// Admin: Khóa
module.exports = catchAsync(async (req, res) => {
  const voucher = await voucherServices.lockVoucher(req.params.id);
  sendResponse(res, 200, "Đã khóa voucher vĩnh viễn", voucher);
});