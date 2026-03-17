const Review = require("../../../models/reviewModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res) => {
  // Chỉ lấy review đang hiện (active: true) của 1 sản phẩm cụ thể
  let filter = { product: req.params.productId, active: true };

  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .paginate();

  const reviews = await features.query;
  sendResponse(res, 200, "Lấy danh sách đánh giá thành công", reviews);
});