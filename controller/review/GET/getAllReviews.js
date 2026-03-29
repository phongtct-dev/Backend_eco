const Review = require("../../../models/reviewModel");
const APIFeatures = require("../../../utils/apiFeatures");
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res) => {
  // 1. Đếm tổng số đánh giá trong Database (để làm phân trang)
  const countFeatures = new APIFeatures(Review.find(), req.query).filter();
  const total = await countFeatures.query.countDocuments();

  // 2. Lấy danh sách đánh giá của trang hiện tại
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const reviews = await features.query;

  // 3. Trả về cấu trúc Object có biến 'total'
  sendResponse(res, 200, "Danh sách toàn bộ đánh giá (Admin)", {
    total: total, // Dòng quan trọng nhất để Frontend tính tổng số trang
    results: reviews.length,
    data: reviews
  });
});