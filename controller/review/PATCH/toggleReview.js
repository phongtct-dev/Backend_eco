const reviewServices = require('../../../services/reviewServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res) => {
  const updatedReview = await reviewServices.toggleStatus(req.params.id);
  
  sendResponse(res, 200, `Đã ${updatedReview.active ? 'hiện' : 'ẩn'} bình luận`, updatedReview);
});