const productServices = require('../../../services/productServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res, next) => {
    // req.files chứa mảng các file từ multer .array()
    const product = await productServices.createProduct(req.body, req.files);

    sendResponse(res, 201, 'Tao san pham moi Thanh Cong', product);
});