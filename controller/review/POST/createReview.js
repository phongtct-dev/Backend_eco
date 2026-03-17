const reviewServices = require('../../../services/reviewServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res) => {
  // Truyền userId từ protect middleware và body vào service
  const newReview = await reviewServices.createReview(req.user._id, req.body);
  
  sendResponse(res, 201, "Đánh giá thành công", newReview);
});