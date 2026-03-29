const Product = require("../../../models/productModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require("../../../utils/catchAsync");
const sendResponse = require("../../../utils/sendResponse");

module.exports = catchAsync(async (req, res, next) => {
  // 1. Tạo query lọc và tìm kiếm 
  const features = new APIFeatures(Product.find({ isDeleted: false, isOnSale: true }), req.query)
    .search()
    .filter();

  // 2. Clone (nhân bản) query ra để đếm tổng số lượng an toàn tuyệt đối
  const total = await features.query.clone().countDocuments();

  // 3. Lấy query gốc tiếp tục sắp xếp và phân trang
  features.sort().paginate();
  const promotions = await features.query;

  // 4. Trả kết quả
  sendResponse(res, 200, "Lấy danh sách khuyến mãi thành công", {
    total: total,
    results: promotions.length,
    data: promotions
  });
});