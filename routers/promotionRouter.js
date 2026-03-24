const express = require("express");
const router = express.Router();
const promotionController = require('../controller/promotion'); // Tự động tìm đến file index.js

const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");




// 
router.use(protect, restrictTo('admin'));


// Tạo/Cập nhật khuyến mãi cho 1 sản phẩm
// Body: { "discountPercent": 20, "discountStart": "2026-03-12", "discountEnd": "2026-03-20" }
router.patch('/:id/setpromotion',promotionController.setpromotion);

router.delete('/:id/stoppromotion',promotionController.stoppromotion)
router.get("/all", protect, restrictTo("admin"), promotionController.getallpromotions);

module.exports = router;