const cartServices = require('../../../services/cartServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async (req, res) => {
  const cart = await cartServices.getCart(req.user._id);
  
  sendResponse(res, 200, "Lấy giỏ hàng thành công", cart);
  
});

