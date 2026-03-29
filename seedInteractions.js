require("dotenv").config();
const mongoose = require("mongoose");
const { fakerVI: faker } = require("@faker-js/faker");

// Import Models
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Voucher = require("./models/voucherModel");
const Review = require("./models/reviewModel");
const Order = require("./models/orderModel");
const Cart = require("./models/cartModel");

// 30 Câu Review của bạn
const reviewComments = [
  "Sản phẩm rất tươi, chất lượng cao, giao hàng nhanh chóng. Rất hài lòng!",
  "Hàng siêu tươi, nhìn là muốn ăn ngay. Giao đúng hẹn, đóng gói cẩn thận.",
  "Tươi ngon hơn mong đợi, ăn rất ngọt và giòn. Sẽ mua lại lần sau.",
  "Chất lượng tốt, sản phẩm tươi rói, không dập úng. Giao hàng rất nhanh.",
  "Rất tươi và ngon, mùi vị tự nhiên. Đóng gói đẹp, ship nhanh.",
  "Hàng tươi lắm ạ, ăn thử một miếng là mê luôn. Giao hàng siêu tốc.",
  "Sản phẩm chất lượng, tươi ngon và bổ dưỡng. Rất đáng tiền!",
  "Tươi hơn ở chợ, giao nhanh, đóng gói kỹ. Khách hài lòng 100%.",
  "Ngon và tươi, không có gì để chê. Sẽ tiếp tục ủng hộ shop.",
  "Hàng về rất tươi, chất lượng ổn định. Giao hàng đúng giờ.",
  "Siêu tươi, thịt chắc ngọt, ăn rất đã. Ship nhanh và cẩn thận.",
  "Sản phẩm ngon, tươi rói, giá hợp lý. Rất hài lòng với lần mua này.",
  "Tươi ngon tự nhiên, không tanh, không dập. Giao hàng nhanh gọn.",
  "Chất lượng vượt mong đợi, rất tươi và đẹp. Sẽ mua thêm nhiều nữa.",
  "Hàng tươi lắm, ăn ngọt và giòn. Đóng gói tốt, ship nhanh.",
  "Rất hài lòng, sản phẩm tươi ngon, bổ dưỡng. Giao đúng hẹn.",
  "Tươi rói, chất lượng cao, giá cả phải chăng. Khuyến khích mọi người mua.",
  "Ngon miệng, tươi và sạch. Giao hàng siêu nhanh, cảm ơn shop!",
  "Sản phẩm rất tốt, tươi ngon như vừa hái/vừa đánh bắt. Sẽ quay lại.",
  "Hàng chất lượng, tươi và thơm. Đóng gói cẩn thận, ship nhanh.",
  "Tươi ngon tuyệt vời, ăn hoài không ngán. Giao hàng đúng thời gian.",
  "Rất tươi, thịt chắc, vị ngon tự nhiên. Lần mua này rất ưng ý.",
  "Sản phẩm đẹp, tươi và ngon. Giao hàng nhanh, phục vụ tốt.",
  "Siêu tươi và chất lượng, đáng đồng tiền. Sẽ giới thiệu cho bạn bè.",
  "Hàng về tươi rói, không hư hỏng. Ăn rất ngon và bổ.",
  "Tươi ngon, đóng gói đẹp, giao nhanh. Rất hài lòng với đơn hàng.",
  "Chất lượng cao, tươi và sạch sẽ. Ăn thấy khỏe miệng hơn hẳn.",
  "Sản phẩm ngon, tươi và an toàn. Ship nhanh, cảm ơn shop nhiều!",
  "Rất tươi, vị ngon tự nhiên, giá hợp lý. Mua lần sau chắc chắn.",
  "Hàng tươi ngon xuất sắc, giao hàng nhanh chóng. 5 sao cho shop"
];

// Hàm trộn mảng ngẫu nhiên
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const seedInteractions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🔥 Đã kết nối MongoDB. Bắt đầu tạo Interactions...");

    // 1. Dọn dẹp bảng tương tác cũ
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    await Voucher.deleteMany({});
    console.log("🧹 Đã xóa sạch Order, Cart, Review, Voucher cũ.");

    // ==========================================
    // 2. SEED VOUCHER (MÃ GIẢM GIÁ)
    // ==========================================
    console.log("🎟️ Đang tạo Vouchers...");
    const vouchers = await Voucher.create([
      { code: "FREESHIP", discountPercentage: 100, maxDiscountAmount: 30000, expiryDate: faker.date.future() },
      { code: "GIAM10", discountPercentage: 10, maxDiscountAmount: 50000, expiryDate: faker.date.future() },
      { code: "GIAM50", discountPercentage: 50, maxDiscountAmount: 100000, expiryDate: faker.date.future() },
      { code: "SIEUSALE", discountPercentage: 20, maxDiscountAmount: 200000, expiryDate: faker.date.future() },
      { code: "KHANHMOI", discountPercentage: 15, maxDiscountAmount: 70000, expiryDate: faker.date.future() }
    ]);

    // ==========================================
    // 3. SEED ORDER & USER RANKS (TỐI ƯU TỐC ĐỘ + NGÀY THÁNG LỊCH SỬ)
    // ==========================================
    console.log("🛍️ Đang xử lý Orders (01/2026 -> Nay) với tốc độ cao...");
    
    let users = await User.find({ role: "user" });
    const products = await Product.find({});
    
    if (users.length < 500 || products.length === 0) {
      console.log("❌ LỖI: Vui lòng đảm bảo đã có đủ 500 User và các Sản phẩm trong DB.");
      process.exit(1);
    }

    users = shuffleArray(users);

    const diamondUsers = users.slice(0, 125);         // 25%
    const goldUsers = users.slice(125, 175);          // 10%
    const silverUsers = users.slice(175, 200);        // 5%
    const memberUsers = users.slice(200, 500);        // 60%

    // Hàm hỗ trợ tạo đơn hàng giả lập để đạt Target chi tiêu
    const createOrdersForUser = async (user, targetSpendMin, targetSpendMax) => {
      let currentSpend = 0;
      const target = faker.number.int({ min: targetSpendMin, max: targetSpendMax });

      while (currentSpend < target) {
        // Ngày lịch sử từ đầu 2026 đến nay
        const orderDate = faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: new Date() });
        const numItems = faker.number.int({ min: 1, max: 3 });
        const items = [];
        let totalProductPrice = 0;

        for (let i = 0; i < numItems; i++) {
          const prod = products[Math.floor(Math.random() * products.length)];
          // Mua sỉ để nhanh đạt mốc (tăng tốc vòng lặp)
          const qty = faker.number.int({ min: 10, max: 50 }); 
          
          const finalPrice = prod.isOnSale ? prod.salePrice : prod.price;
          items.push({
            product: prod._id,
            name: prod.name,
            price: prod.price,
            salePrice: prod.isOnSale ? prod.salePrice : 0,
            quantity: qty
          });
          totalProductPrice += finalPrice * qty;
        }

        let finalAmount = totalProductPrice;
        let voucherUsed = null;
        if (Math.random() > 0.7) {
          const v = vouchers[Math.floor(Math.random() * vouchers.length)];
          const discount = Math.min((totalProductPrice * v.discountPercentage) / 100, v.maxDiscountAmount);
          finalAmount -= discount;
          voucherUsed = { code: v.code, discountAmount: discount };
        }

        const order = await Order.create({
          user: user._id,
          items: items,
          voucher: voucherUsed,
          totalProductPrice,
          finalAmount,
          shippingAddress: { fullName: user.fullName, phone: user.phone, address: user.address },
          status: "SUCCESS", 
          paymentMethod: Math.random() > 0.5 ? "COD" : "ONLINE",
          paymentStatus: "PAID",
          statusHistory: [
            { status: "PENDING", updatedAt: new Date(orderDate.getTime() - 1000 * 60 * 60 * 24), note: "Hệ thống ghi nhận đơn hàng" },
            { status: "SUCCESS", updatedAt: orderDate, note: "Đã giao hàng thành công" }
          ],
          createdAt: orderDate,
          updatedAt: orderDate  
        });

        currentSpend += finalAmount;
        user.orders.push(order._id);
        
        // TỐI ƯU: Update số lượng đã bán (sold) bất đồng bộ
        const productUpdatePromises = items.map(item => 
            Product.findByIdAndUpdate(item.product, { $inc: { sold: item.quantity } })
        );
        await Promise.all(productUpdatePromises);
      }

      user.totalSpent = currentSpend;
      await user.save(); // Kích hoạt hook cập nhật Rank
    };

    // TỐI ƯU: Xử lý theo lô (Chunk) để không bị ngẽn mạng
    const processInChunks = async (userArray, min, max, chunkSize = 20) => {
        for (let i = 0; i < userArray.length; i += chunkSize) {
            const chunk = userArray.slice(i, i + chunkSize);
            await Promise.all(chunk.map(u => createOrdersForUser(u, min, max)));
        }
    };

    console.log("   -> Tạo nhóm Diamond (Chi tiêu 21M - 30M)...");
    await processInChunks(diamondUsers, 21000000, 30000000);
    
    console.log("   -> Tạo nhóm Gold (Chi tiêu 11M - 18M)...");
    await processInChunks(goldUsers, 11000000, 18000000);
    
    console.log("   -> Tạo nhóm Silver (Chi tiêu 6M - 9M)...");
    await processInChunks(silverUsers, 6000000, 9000000);
    
    console.log("   -> Tạo nhóm Member (Chi tiêu 0 - 3M)...");
    await processInChunks(memberUsers, 0, 3000000);

    // ==========================================
    // 4. SEED REVIEW (ĐÁNH GIÁ)
    // ==========================================
    console.log("⭐ Đang tạo Reviews...");
    for (const prod of products) {
      const numReviews = faker.number.int({ min: 3, max: 7 });
      const reviewers = shuffleArray([...users]).slice(0, numReviews);

      const reviewPromises = reviewers.map(reviewer => {
          const reviewDate = faker.date.between({ from: '2026-01-01T00:00:00.000Z', to: new Date() });
          return Review.create({
            product: prod._id,
            user: reviewer._id,
            rating: faker.number.int({ min: 4, max: 5 }), 
            review: reviewComments[Math.floor(Math.random() * reviewComments.length)],
            createdAt: reviewDate,
            updatedAt: reviewDate
          }).catch(err => { if(err.code !== 11000) console.log(err) });
      });
      await Promise.all(reviewPromises);
    }

    // ==========================================
    // 5. SEED CART (GIỎ HÀNG)
    // ==========================================
    console.log("🛒 Đang tạo Giỏ hàng đang mua dở...");
    const cartUsers = shuffleArray([...users]).slice(0, 50);
    
    const cartPromises = cartUsers.map(u => {
      const cartItems = [];
      const numItems = faker.number.int({ min: 1, max: 4 });
      
      for (let i = 0; i < numItems; i++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        if (!cartItems.find(item => item.product.toString() === prod._id.toString())) {
            cartItems.push({ product: prod._id, quantity: faker.number.int({ min: 1, max: 5 }) });
        }
      }
      return Cart.create({ user: u._id, items: cartItems });
    });
    await Promise.all(cartPromises);

    console.log("🎉 XONG! HỆ THỐNG ĐÃ SẴN SÀNG VỚI DATA SIÊU THỰC TẾ TRẢI DÀI TỪ THÁNG 1/2026 ĐẾN NAY.");
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Lỗi khi seed Interactions: ", error);
    process.exit(1);
  }
};

seedInteractions();