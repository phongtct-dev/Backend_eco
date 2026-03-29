require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/categoryModel"); // Sửa lại đường dẫn nếu file của bạn nằm ở thư mục khác

const categoriesData = [
  {
    name: "Apple (Táo)",
    description: "Táo tươi ngon, đỏ mọng, nguyên quả, sẵn sàng cho bữa ăn lành mạnh.",
    image: "https://images.pexels.com/photos/5539074/pexels-photo-5539074.jpeg",
    public_id: "seed_apple",
    sortOrder: 1,
  },
  {
    name: "Banana (Chuối)",
    description: "Chuối chín vàng tự nhiên, ngọt ngào, giàu kali và năng lượng.",
    image: "https://images.pexels.com/photos/7457222/pexels-photo-7457222.jpeg",
    public_id: "seed_banana",
    sortOrder: 2,
  },
  {
    name: "Orange (Cam)",
    description: "Cam tươi mát, giàu vitamin C, hương thơm quyến rũ.",
    image: "https://images.pexels.com/photos/30210309/pexels-photo-30210309.jpeg",
    public_id: "seed_orange",
    sortOrder: 3,
  },
  {
    name: "Shrimp (Tôm)",
    description: "Tôm tươi sống, thịt chắc, thích hợp chế biến nhiều món ngon.",
    image: "https://images.pexels.com/photos/19658285/pexels-photo-19658285.jpeg",
    public_id: "seed_shrimp",
    sortOrder: 4,
  },
  {
    name: "Salmon (Cá hồi)",
    description: "Cá hồi tươi, thịt hồng đẹp mắt, giàu omega-3 tốt cho sức khỏe.",
    image: "https://images.pexels.com/photos/7451966/pexels-photo-7451966.jpeg",
    public_id: "seed_salmon",
    sortOrder: 5,
  },
  {
    name: "Tuna (Cá ngừ)",
    description: "Cá ngừ tươi, thịt đỏ săn chắc, nguyên liệu cao cấp cho sushi và salad.",
    image: "https://images.pexels.com/photos/8351648/pexels-photo-8351648.jpeg",
    public_id: "seed_tuna",
    sortOrder: 6,
  }
];

const seedCategory = async () => {
  try {
    // 1. Kết nối Database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🔥 Đã kết nối MongoDB. Bắt đầu seed Category...");

    // 2. Dọn dẹp collection Category cũ (nếu có)
    await Category.deleteMany({});
    console.log("🧹 Đã xóa sạch dữ liệu Category cũ.");

    // 3. Chèn dữ liệu mới (Dùng vòng lặp và .create() để kích hoạt pre-save middleware tạo slug)
    for (const cat of categoriesData) {
      await Category.create(cat);
    }
    
    console.log(`✅ Đã thêm thành công ${categoriesData.length} danh mục!`);
    
    // 4. Ngắt kết nối để kết thúc script
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed Category: ", error);
    process.exit(1);
  }
};

seedCategory();