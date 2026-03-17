const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartServices.addToCart(req.user._id, productId, quantity || 1);
  sendResponse(res, 200, "Đã thêm vào giỏ hàng", cart);
});