const productServices = require('../../../services/productServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res, next) => {
    await productServices.deleteProduct(req.params.id);

    // Trả về code 204 (No Content) hoặc 200 tùy style của bạn
    sendResponse(res, 200, 'Xoa san pham thanh cong', null);
});