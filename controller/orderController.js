// Chức năng Webhook nhận diện thanh toán thành công
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const emailServices = require("../services/emailServices");



exports.webhookCheckout = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Đây là raw body nhờ cấu hình app.js bên trên
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý sự kiện thanh toán thành công
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.client_reference_id;

    // Tìm đơn hàng và lấy thông tin user để lấy email
    const order = await Order.findById(orderId).populate('user');
    
    if (order) {
      // 1. Cập nhật đơn hàng
      order.paymentStatus = 'PAID';
      order.status = 'CONFIRMED';
      order.statusHistory.push({ 
        status: 'CONFIRMED', 
        note: 'Thanh toán thành công qua Stripe' 
      });
      await order.save();

      // 2. Xóa giỏ hàng
      await Cart.findOneAndUpdate({ user: order.user._id }, { $set: { items: [] } });

      // 3. GỬI EMAIL TỰ ĐỘNG
      try {
        const userEmail = order.user.email; // Lấy email từ user đã populate
        await emailServices.sendOrderSuccessEmail(userEmail, order);
        console.log(`Email xác nhận đã gửi tới: ${userEmail}`);
      } catch (mailError) {
        console.error("Lỗi gửi email:", mailError);
        // Không return lỗi ở đây để tránh Stripe gửi lại webhook liên tục khi mail lỗi
      }
    }
  }

  res.status(200).json({ received: true });
};