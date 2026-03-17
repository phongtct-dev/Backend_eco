const productServices = require('../../../services/productServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res, next) => {
    const product = await productServices.getProductById(req.params.id);

    sendResponse(res, 200, 'lay chi tiet san pham thanh cong', product);
});