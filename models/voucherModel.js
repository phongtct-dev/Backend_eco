const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Mã voucher là bắt buộc"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "Phần trăm giảm giá là bắt buộc"],
      min: [1, "Giảm tối thiểu 1%"],
      max: [100, "Giảm tối đa 100%"],
    },
    maxDiscountAmount: {
      type: Number,
      required: [true, "Số tiền giảm tối đa là bắt buộc"],
      default: 5000000, // 5 triệu như yêu cầu của bạn
    },
    usageLimit: {
      type: Number,
      default: 100, // Mặc định 100 lượt sử dụng
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usersUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiryDate: {
      type: Date,
      required: [true, "Hạn sử dụng là bắt buộc"],
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh mã code
voucherSchema.index({ code: 1, isLocked: 1 });

module.exports = mongoose.model("Voucher", voucherSchema);