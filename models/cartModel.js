const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Mỗi user chỉ có 1 giỏ hàng
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Số lượng không được ít hơn 1"],
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Tính toán tổng tiền và chi tiết khuyến mãi ngay khi truy vấn
cartSchema.virtual("cartStats").get(function () {
  let totalOriginalPrice = 0;
  let totalFinalPrice = 0;

  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      if (item.product) {
        // Tận dụng virtual finalPrice từ Product Model
        const price = item.product.price || 0;
        const finalPrice = item.product.finalPrice || price;

        totalOriginalPrice += price * item.quantity;
        totalFinalPrice += finalPrice * item.quantity;
      }
    });
  }

  return {
    totalOriginalPrice, // Tổng tiền gốc
    totalFinalPrice,    // Tổng tiền phải trả sau giảm giá
    totalDiscount: totalOriginalPrice - totalFinalPrice, // Số tiền tiết kiệm được
    itemCount: this.items.length // Tổng số loại mặt hàng
  };
});

module.exports = mongoose.model("Cart", cartSchema);