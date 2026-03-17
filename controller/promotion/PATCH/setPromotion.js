const productServices = require('../../../services/productServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async(req, res , next) => {
    const product = await productServices.updateProductPromotion(
        req.params.id, 
        req.body
    );

    sendResponse(res, 200, "Thiết lập khuyến mãi thành công", product);
})