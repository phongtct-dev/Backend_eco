const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const AppError = require("../utils/appError");

// 1. Logic tạo Review
exports.createReview = async (userId, reviewData) => {
  const { productId, rating, review } = reviewData;

  // Kiểm tra đã mua và đơn hàng SUCCESS chưa
  const hasPurchased = await Order.findOne({
    user: userId,
    status: "SUCCESS",
    "items.product": productId
  });

  if (!hasPurchased) {
    throw new AppError("Bạn chỉ được đánh giá sản phẩm đã mua và nhận hàng thành công!", 403);
  }

  // Tạo review (Compound Index trong Model sẽ chặn nếu trùng)
  return await Review.create({
    product: productId,
    user: userId,
    rating,
    review
  });
};

// 2. Logic Admin ẩn/hiện Review
exports.toggleStatus = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new AppError("Không tìm thấy review", 404);

  review.active = !review.active;
  await review.save();
  
  // Model middleware post-save sẽ tự gọi calcAverageRatings
  return review;
};