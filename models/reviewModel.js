const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Nội dung bình luận không được để trống"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Vui lòng chọn số sao đánh giá"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review phải thuộc về một sản phẩm"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review phải thuộc về một người dùng"],
    },
    active: {
      type: Boolean,
      default: true, // Admin có thể chuyển thành false để ẩn/khóa
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ràng buộc: Mỗi User chỉ Review 1 sản phẩm 1 lần duy nhất
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method để tính trung bình cộng số sao
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, active: true } },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, // Giá trị mặc định
    });
  }
};

// Cập nhật lại sao khi có review mới được lưu
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

// Middleware xử lý việc Populate thông tin User khi lấy Review
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "fullName avatar",
  });
  
});

module.exports = mongoose.model("Review", reviewSchema);