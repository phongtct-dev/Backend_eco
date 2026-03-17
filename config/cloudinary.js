const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// console.log(process.env.CLOUD_NAME);
// console.log(process.env.API_KEY);
// console.log(process.env.API_SECRET);

// cloudinary.api.usage()
//   .then(result => {
//     console.log("✅ Kết nối Cloudinary thành công! Tài khoản đang hoạt động.");
//   })
//   .catch(err => {
//     console.log("❌ Lỗi kết nối Cloudinary!");
//     console.log("- Chi tiết:", err.error ? err.error.message : err.message);
//     console.log("- Mã lỗi:", err.http_code);
//   });


module.exports = cloudinary;
