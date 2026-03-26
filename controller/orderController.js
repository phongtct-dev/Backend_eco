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
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`✅ Webhook nhận event: ${event.type}`);
  } catch (err) {
    console.error(`❌ Webhook signature error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.client_reference_id;



    const order = await Order.findById(orderId).populate('user').populate('items.product');
    
    if (!order) {
      
      return res.status(200).json({ received: true });
    }

    

    // Cập nhật order
    order.paymentStatus = 'PAID';
    order.status = 'CONFIRMED';
    order.statusHistory.push({ 
      status: 'CONFIRMED', 
      note: 'Thanh toán thành công qua Stripe' 
    });
    await order.save();

    // Xóa giỏ hàng
    await Cart.findOneAndUpdate({ user: order.user._id }, { $set: { items: [] } });

    // === PHẦN GỬI EMAIL - ĐÃ SỬA ĐỂ DỄ DEBUG ===
    try {
      const userEmail = order.user?.email;
      if (!userEmail) {
        console.error("❌ Không có email user");
        throw new Error("User email is missing");
      }

      

      await emailServices.sendOrderSuccessEmail(userEmail, order);
      
      console.log(`✅ Email đã gửi thành công tới: ${userEmail}`);
    } catch (mailError) {
      console.error("❌ LỖI GỬI EMAIL:", mailError.message);
      console.error("Stack:", mailError.stack);   // Thêm stack để xem chi tiết lỗi
      // Vẫn trả 200 để Stripe không retry liên tục
    }
  }

  res.status(200).json({ received: true });
};