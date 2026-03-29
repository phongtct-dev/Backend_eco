require("dotenv").config();
const mongoose = require("mongoose");
const { fakerVI: faker } = require("@faker-js/faker");
const Product = require("./models/productModel");
const Category = require("./models/categoryModel");

// Danh sách tỉnh thành để ghép tên sản phẩm
const provinces = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", 
  "Lâm Đồng", "Đà Lạt", "Bến Tre", "Cà Mau", "Tiền Giang", 
  "Nghệ An", "Thanh Hóa", "Đồng Nai", "Bình Dương", "Sơn La", 
  "Hòa Bình", "Ninh Thuận", "Bình Thuận", "Khánh Hòa", "Phú Quốc"
];

// Dữ liệu hình ảnh CHUẨN 6 DANH MỤC bạn cung cấp
const productImagesData = {
  "Apple (Táo)": [
    "https://images.pexels.com/photos/7156064/pexels-photo-7156064.jpeg",
    "https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg",
    "https://images.pexels.com/photos/39803/pexels-photo-39803.jpeg",
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
    "https://images.pexels.com/photos/31084867/pexels-photo-31084867.jpeg",
    "https://images.pexels.com/photos/30900280/pexels-photo-30900280.jpeg",
    "https://images.pexels.com/photos/5392556/pexels-photo-5392556.jpeg",
    "https://images.pexels.com/photos/19583764/pexels-photo-19583764.jpeg",
    "https://images.pexels.com/photos/10568559/pexels-photo-10568559.jpeg",
    "https://images.pexels.com/photos/19808828/pexels-photo-19808828.jpeg",
    "https://images.pexels.com/photos/8416545/pexels-photo-8416545.jpeg",
    "https://images.pexels.com/photos/31558767/pexels-photo-31558767.jpeg",
    "https://images.pexels.com/photos/16000118/pexels-photo-16000118.jpeg",
    "https://images.pexels.com/photos/3903599/pexels-photo-3903599.jpeg",
    "https://images.pexels.com/photos/9814708/pexels-photo-9814708.jpeg",
    "https://images.pexels.com/photos/28826712/pexels-photo-28826712.jpeg",
    "https://images.pexels.com/photos/22043102/pexels-photo-22043102.jpeg"
  ],
  "Banana (Chuối)": [
    "https://images.unsplash.com/photo-1543218024-57a70143c369",
    "https://images.pexels.com/photos/16959795/pexels-photo-16959795.jpeg",
    "https://images.pexels.com/photos/30873714/pexels-photo-30873714.jpeg",
    "https://images.pexels.com/photos/30750546/pexels-photo-30750546.jpeg",
    "https://images.pexels.com/photos/32313619/pexels-photo-32313619.jpeg",
    "https://images.pexels.com/photos/30741700/pexels-photo-30741700.jpeg",
    "https://images.pexels.com/photos/36075337/pexels-photo-36075337.jpeg",
    "https://images.pexels.com/photos/35735252/pexels-photo-35735252.jpeg",
    "https://images.pexels.com/photos/31387420/pexels-photo-31387420.jpeg",
    "https://images.pexels.com/photos/8487034/pexels-photo-8487034.jpeg"
  ],
  "Orange (Cam)": [
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b",
    "https://images.pexels.com/photos/18452311/pexels-photo-18452311.jpeg",
    "https://images.pexels.com/photos/32801459/pexels-photo-32801459.jpeg",
    "https://images.pexels.com/photos/29586322/pexels-photo-29586322.jpeg",
    "https://images.pexels.com/photos/30595018/pexels-photo-30595018.jpeg",
    "https://images.pexels.com/photos/15387210/pexels-photo-15387210.jpeg",
    "https://images.pexels.com/photos/5648228/pexels-photo-5648228.jpeg",
    "https://images.pexels.com/photos/30530318/pexels-photo-30530318.jpeg",
    "https://images.pexels.com/photos/36037949/pexels-photo-36037949.jpeg",
    "https://images.pexels.com/photos/33492696/pexels-photo-33492696.jpeg",
    "https://images.pexels.com/photos/5945761/pexels-photo-5945761.jpeg",
    "https://images.pexels.com/photos/16194318/pexels-photo-16194318.jpeg",
    "https://images.pexels.com/photos/36562799/pexels-photo-36562799.jpeg"
  ],
  "Shrimp (Tôm)": [
    "https://images.pexels.com/photos/21771249/pexels-photo-21771249.jpeg",
    "https://images.pexels.com/photos/33211231/pexels-photo-33211231.jpeg",
    "https://images.pexels.com/photos/5273798/pexels-photo-5273798.jpeg",
    "https://images.pexels.com/photos/12417979/pexels-photo-12417979.jpeg",
    "https://images.pexels.com/photos/33202174/pexels-photo-33202174.jpeg",
    "https://images.pexels.com/photos/25014833/pexels-photo-25014833.jpeg",
    "https://images.pexels.com/photos/32230041/pexels-photo-32230041.jpeg",
    "https://images.pexels.com/photos/6573331/pexels-photo-6573331.jpeg",
    "https://images.pexels.com/photos/19503800/pexels-photo-19503800.jpeg"
  ],
  "Salmon (Cá hồi)": [
    "https://images.pexels.com/photos/34079757/pexels-photo-34079757.jpeg",
    "https://images.pexels.com/photos/36108525/pexels-photo-36108525.jpeg",
    "https://images.pexels.com/photos/17585461/pexels-photo-17585461.jpeg",
    "https://images.pexels.com/photos/28620131/pexels-photo-28620131.jpeg",
    "https://images.pexels.com/photos/3311091/pexels-photo-3311091.jpeg",
    "https://images.pexels.com/photos/19833845/pexels-photo-19833845.jpeg"
  ],
  "Tuna (Cá ngừ)": [
    "https://images.pexels.com/photos/15201054/pexels-photo-15201054.jpeg",
    "https://images.pexels.com/photos/6148937/pexels-photo-6148937.jpeg",
    "https://images.pexels.com/photos/12829694/pexels-photo-12829694.jpeg",
    "https://images.pexels.com/photos/28916474/pexels-photo-28916474.jpeg",
    "https://images.pexels.com/photos/8351642/pexels-photo-8351642.jpeg",
    "https://images.pexels.com/photos/8609547/pexels-photo-8609547.jpeg",
    "https://images.pexels.com/photos/4628207/pexels-photo-4628207.jpeg"
  ]
};

const seedProduct = async () => {
  try {
    // 1. Kết nối DB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🔥 Đã kết nối MongoDB. Bắt đầu seed Product...");

    // 2. Dọn dẹp collection Product cũ
    await Product.deleteMany({});
    console.log("🧹 Đã xóa sạch dữ liệu Product cũ.");

    // 3. Lấy toàn bộ Category từ DB lên để lấy ObjectId
    const categoriesInDB = await Category.find({});
    if (categoriesInDB.length === 0) {
      console.log("❌ LỖI: Chưa có dữ liệu Category. Vui lòng chạy file seedCategory.js trước!");
      process.exit(1);
    }

    let totalCreated = 0;

    // 4. Lặp qua object hình ảnh bạn cung cấp
    for (const [categoryName, imageUrls] of Object.entries(productImagesData)) {
      
      // Tìm Object Category tương ứng trong DB bằng tên chính xác
      const categoryDoc = categoriesInDB.find(c => c.name === categoryName);
      
      if (!categoryDoc) {
        console.log(`⚠️ Bỏ qua: Không tìm thấy danh mục '${categoryName}' trong DB. Bạn kiểm tra lại tên nhé.`);
        continue;
      }

      console.log(`⏳ Đang tạo sản phẩm cho danh mục: ${categoryName}...`);

      // Mỗi ảnh tạo thành 1 sản phẩm
      for (const [index, imgUrl] of imageUrls.entries()) {
        
        // Random 1 tỉnh thành
        const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
        
        // Random Giá từ 200,000 đến 500,000
        const randomPrice = Math.floor(Math.random() * (500000 - 200000 + 1)) + 200000;
        
        // Tỷ lệ 30% có giảm giá (từ 5% đến 25%)
        const hasDiscount = Math.random() > 0.7;
        const discountPercent = hasDiscount ? Math.floor(Math.random() * 20) + 5 : 0;

        // Trích xuất tên tiếng Việt đẹp hơn (VD: "Apple (Táo)" -> "Táo")
        let niceName = categoryName;
        const match = categoryName.match(/\(([^)]+)\)/);
        if (match) {
           niceName = match[1]; // Lấy chữ bên trong ngoặc
        }

        // Tạo dữ liệu (Dùng .create để kích hoạt hook tự tính giá Sale và tự tạo Slug)
        await Product.create({
          name: `${niceName} ${randomProvince} Tuyển Chọn (Mã ${index + 1})`, // Kết quả: Táo Hà Nội Tuyển Chọn
          sku: `SKU-${categoryDoc._id.toString().substring(18, 24).toUpperCase()}-${faker.string.alphanumeric(4).toUpperCase()}-${index}`,
          category: categoryDoc._id,
          brand: "Nông Sản Việt",
          price: randomPrice,
          discountPercent: discountPercent,
          discountStart: hasDiscount ? new Date() : undefined,
          discountEnd: hasDiscount ? new Date(new Date().setDate(new Date().getDate() + 15)) : undefined, // Sale kéo dài 15 ngày
          stock: faker.number.int({ min: 10, max: 200 }),
          unit: "kg",
          sold: faker.number.int({ min: 0, max: 50 }),
          description: `Sản phẩm ${niceName} cao cấp được thu hoạch trực tiếp tại ${randomProvince}, đảm bảo độ tươi ngon, chất lượng chuẩn VietGAP. Giao hàng tận nơi, bao đổi trả nếu hư hỏng.`,
          images: [
            { 
              url: imgUrl, 
              public_id: `seed_${niceName}_${Date.now()}_${index}` // Tạo public_id giả cho DB
            }
          ],
          isPublished: true,
        });

        totalCreated++;
      }
    }
    
    console.log(`✅ THÀNH CÔNG! Đã tạo xong tổng cộng ${totalCreated} sản phẩm thực tế vào DB.`);
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Lỗi khi seed Product: ", error);
    process.exit(1);
  }
};

seedProduct();