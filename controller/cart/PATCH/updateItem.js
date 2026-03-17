const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartServices.updateQuantity(req.user._id, productId, quantity);
  sendResponse(res, 200, "Cập nhật số lượng thành công", cart);
});