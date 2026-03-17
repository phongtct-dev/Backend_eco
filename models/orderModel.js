const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,     // Lưu lại tên SP tại thời điểm mua (đề phòng SP đổi tên)
        price: Number,    // Giá gốc
        salePrice: Number, // Giá đã giảm (nếu có)
        quantity: { type: Number, required: true },
      },
    ],
    voucher: {
      code: String,
      discountAmount: { type: Number, default: 0 },
    },
    totalProductPrice: { type: Number, required: true }, // Tổng tiền hàng (trước voucher)
    finalAmount: { type: Number, required: true },      // Tổng tiền cuối khách phải trả
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "SUCCESS", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "UNPAID",
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// Index để truy vấn lịch sử mua hàng nhanh
orderSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);