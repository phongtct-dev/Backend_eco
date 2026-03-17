const productServices = require('../../../services/productServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res, next) => {
    // req.files: Mảng ảnh mới (nếu khách hàng muốn thay ảnh)
    // req.body: Các thông tin text cần sửa (name, price, stock...)
    const updatedProduct = await productServices.updateProduct(
        req.params.id, 
        req.body, 
        req.files
    );

    sendResponse(res, 200, 'Cap nhat san pham Thanh cong', updatedProduct);
});