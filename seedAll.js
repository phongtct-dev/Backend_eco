const { execSync } = require("child_process");

// Danh sách các file seed theo đúng thứ tự bắt buộc
const scripts = [
  { file: "seedCategory.js", name: "1. Categories (Danh mục)" },
  { file: "seedUser.js", name: "2. Users (Người dùng)" },
  { file: "seedProduct.js", name: "3. Products (Sản phẩm)" },
  { file: "seedInteractions.js", name: "4. Interactions (Đơn hàng, Đánh giá, Giỏ hàng...)" }
];

console.log("🚀 =============================================== 🚀");
console.log("🌟 BẮT ĐẦU QUÁ TRÌNH TỰ ĐỘNG ĐỒNG BỘ TOÀN BỘ DỮ LIỆU 🌟");
console.log("🚀 =============================================== 🚀\n");

const runSeeds = () => {
  const startTime = Date.now();

  for (const script of scripts) {
    console.log(`⏳ Đang chạy: ${script.name} ...`);
    try {
      // execSync sẽ chạy lệnh terminal đồng bộ và chờ đến khi chạy xong mới đi tiếp
      // stdio: 'inherit' giúp in thẳng log của file con ra màn hình terminal hiện tại
      execSync(`node ${script.file}`, { stdio: "inherit" });
      console.log(`✅ Hoàn thành: ${script.name}\n`);
    } catch (error) {
      console.error(`❌ LỖI NGHIÊM TRỌNG KHI CHẠY ${script.file}. QUÁ TRÌNH BỊ HỦY!`);
      process.exit(1);
    }
  }

  const endTime = Date.now();
  const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

  console.log("🎉 =============================================== 🎉");
  console.log(`🏆 XONG! TOÀN BỘ DATABASE ĐÃ ĐƯỢC SEED THÀNH CÔNG TRONG ${timeTaken} GIÂY.`);
  console.log("🎉 =============================================== 🎉");
};

runSeeds();