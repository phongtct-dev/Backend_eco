require("dotenv").config();
const mongoose = require("mongoose");
const { fakerVI: faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt"); // Thêm thư viện hash mật khẩu
const User = require("./models/userModel");

const seedUsers = async () => {
  try {
    // 1. Kết nối Database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🔥 Đã kết nối MongoDB. Bắt đầu seed 500 User...");

    // 2. Dọn dẹp collection User cũ
    await User.deleteMany({});
    console.log("🧹 Đã xóa sạch toàn bộ dữ liệu User cũ.");

    // 3. Hash mật khẩu (Chỉ làm 1 lần để tối ưu hiệu năng)
    console.log("🔐 Đang băm (hash) mật khẩu...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("User123456", salt);

    // 4. Sinh dữ liệu 500 User
    console.log("🌱 Đang tạo danh sách 500 Users ngẫu nhiên...");
    const usersToCreate = [];

    for (let i = 0; i < 500; i++) {
      usersToCreate.push({
        fullName: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword, // Dùng chung mật khẩu đã mã hóa
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        role: "user", // Toàn bộ là user thường, không có admin
        verified: true, // Cho phép tài khoản đã xác thực luôn
        avatar: faker.image.avatar(),
        totalSpent: 0,
        rank: "Member"
      });
    }

    // 5. Insert hàng loạt vào Database
    console.log("⏳ Đang đẩy dữ liệu lên Database. Vui lòng đợi...");
    await User.insertMany(usersToCreate);
    
    console.log(`✅ THÀNH CÔNG! Đã tạo 500 người dùng với mật khẩu "User123456".`);

    // 6. Ngắt kết nối
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed User: ", error);
    process.exit(1);
  }
};

seedUsers();