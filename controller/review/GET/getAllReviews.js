const Review = require("../../../models/reviewModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res) => {
  // Lấy toàn bộ review (cả ẩn và hiện) để admin quản lý
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const reviews = await features.query;
  sendResponse(res, 200, "Danh sách toàn bộ đánh giá (Admin)", reviews);
});