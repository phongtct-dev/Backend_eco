const Product = require("../../../models/productModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  // Admin muốn xem tất cả sản phẩm đang có cấu hình Sale (kể cả chưa đến ngày hoặc đã hết hạn)
  const features = new APIFeatures(Product.find({ isOnSale: true, isDeleted: false }), req.query)
    .search()
    .filter()
    .sort()
    .paginate();

  const products = await features.query;

  sendResponse(res, 200, "Lấy danh sách khuyến mãi thành công", {
    results: products.length,
    data: products
  });
});