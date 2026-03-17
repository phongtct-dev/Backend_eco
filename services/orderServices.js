const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Voucher = require("../models/voucherModel");
const voucherServices = require("./voucherServices");
const AppError = require("../utils/appError");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



exports.checkout = async (userId, checkoutData, userEmail) => {
  const { voucherCode, shippingAddress, paymentMethod } = checkoutData;

  // 1. Lấy giỏ hàng & Tính toán tiền (Logic cũ của bạn)
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) throw new AppError("Giỏ hàng trống", 400);

  const totalProductPrice = cart.cartStats.totalFinalPrice;
  let discountAmount = 0;
  let voucherData = null;

  if (voucherCode) {
    const vResult = await voucherServices.validateVoucher(voucherCode, userId, totalProductPrice);
    discountAmount = vResult.discountAmount;
    voucherData = { code: voucherCode, discountAmount };
  }
  const finalAmount = totalProductPrice - discountAmount;

  // 2. KIỂM TRA & TRỪ KHO (Atomic Update - Giữ nguyên logic an toàn của bạn)
  const bulkProductUpdates = cart.items.map((item) => {
    return Product.findOneAndUpdate(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity, sold: item.quantity } },
      { new: true }
    );
  });
  const updateResults = await Promise.all(bulkProductUpdates);

  if (updateResults.includes(null)) {
    // Rollback logic của bạn...
    for (let i = 0; i < updateResults.length; i++) {
      if (updateResults[i]) {
        await Product.findByIdAndUpdate(cart.items[i].product._id, {
          $inc: { stock: cart.items[i].quantity, sold: -cart.items[i].quantity }
        });
      }
    }
    throw new AppError("Một số sản phẩm đã hết hàng", 400);
  }

  // 3. Cập nhật Voucher (Atomic)
  if (voucherCode) {
    await Voucher.findOneAndUpdate(
      { code: voucherCode.toUpperCase() },
      { $inc: { usedCount: 1 }, $push: { usersUsed: userId } }
    );
  }

  // 4. Tạo Đơn hàng trong Database (paymentStatus = UNPAID)
  const newOrder = await Order.create({
    user: userId,
    items: cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      salePrice: item.product.finalPrice,
      quantity: item.quantity
    })),
    voucher: voucherData,
    totalProductPrice,
    finalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: "UNPAID",
    statusHistory: [{ status: "PENDING", note: "Đơn hàng đã được khởi tạo" }]
  });

  // 5. XỬ LÝ THANH TOÁN STRIPE (Nếu chọn ONLINE)
  if (paymentMethod === "ONLINE") {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // Gửi client_reference_id để Webhook nhận diện được Order này
      client_reference_id: newOrder._id.toString(),
      customer_email: userEmail,
      line_items: [{
        price_data: {
          currency: 'vnd',
          unit_amount: finalAmount, // VND là số nguyên trực tiếp
          product_data: {
            name: `Thanh toán đơn hàng #${newOrder._id}`,
            description: `Tổng tiền thanh toán cho ${cart.items.length} mặt hàng`,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${newOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-fail`,
    });

    return { status: "success", checkoutUrl: session.url, order: newOrder };
  }

  // 6. Nếu là COD: Xóa giỏ hàng luôn và trả về đơn hàng
  await Cart.findByIdAndUpdate(cart._id, { $set: { items: [] } });
  return { status: "success", order: newOrder };
};