const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

const voucherServices = require('../../../services/voucherServices');


// User: Check thử mã (Dùng trong trang giỏ hàng)
module.exports = catchAsync(async (req, res) => {
  const { code } = req.body;
  
  // Lấy giỏ hàng hiện tại để lấy tiền sau sale
  const cart = await cartServices.getCart(req.user._id);
  const currentTotal = cart.cartStats.totalFinalPrice;

  const result = await voucherServices.validateVoucher(code, req.user._id, currentTotal);
  sendResponse(res, 200, "Mã giảm giá hợp lệ", result);
});