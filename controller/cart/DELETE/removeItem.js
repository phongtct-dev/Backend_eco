const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async (req, res) => {
  const cart = await cartServices.removeFromCart(req.user._id, req.params.productId);
  sendResponse(res, 200, "Đã xóa sản phẩm khỏi giỏ hàng", cart);
});

