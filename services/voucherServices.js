const Voucher = require("../models/voucherModel");
const AppError = require("../utils/appError");

/**
 * 1. ADMIN: Tạo Voucher
 */
exports.createVoucher = async (data) => {
  return await Voucher.create(data);
};

/**
 * 2. ADMIN: Khóa Voucher vĩnh viễn
 */
exports.lockVoucher = async (id) => {
  const voucher = await Voucher.findByIdAndUpdate(
    id,
    { isLocked: true },
    { new: true }
  );
  if (!voucher) throw new AppError("Không tìm thấy mã voucher", 404);
  return voucher;
};

/**
 * 3. USER/SYSTEM: Kiểm tra Voucher hợp lệ
 */
exports.validateVoucher = async (code, userId, currentCartTotal) => {
  const voucher = await Voucher.findOne({ code: code.toUpperCase() });

  // Check 1: Mã tồn tại
  if (!voucher) throw new AppError("Mã giảm giá không tồn tại", 404);

  // Check 2: Trạng thái khóa
  if (voucher.isLocked) throw new AppError("Mã giảm giá này đã bị vô hiệu hóa bởi Admin", 403);

  // Check 3: Hạn sử dụng
  if (voucher.expiryDate < new Date()) throw new AppError("Mã giảm giá đã hết hạn", 400);

  // Check 4: Số lượng còn lại
  if (voucher.usedCount >= voucher.usageLimit) throw new AppError("Mã giảm giá đã hết lượt sử dụng", 400);

  // Check 5: User đã dùng chưa
  if (voucher.usersUsed.includes(userId)) throw new AppError("Bạn đã sử dụng mã này rồi", 400);

  // Tính toán số tiền giảm theo công thức: Min(Total * %, Max)
  let discountAmount = (currentCartTotal * voucher.discountPercentage) / 100;
  if (discountAmount > voucher.maxDiscountAmount) {
    discountAmount = voucher.maxDiscountAmount;
  }

  return {
    voucherId: voucher._id,
    code: voucher.code,
    discountAmount,
    finalTotal: currentCartTotal - discountAmount
  };
};