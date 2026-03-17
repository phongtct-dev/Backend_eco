const productServices = require('../../../services/productServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async(req, res , next) => {
    const product = await productServices.endPromotionEarly(req.params.id);

    sendResponse(res, 200, "Đã kết thúc khuyến mãi cho sản phẩm này", product);
})