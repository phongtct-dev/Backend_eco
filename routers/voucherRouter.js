const express = require("express");
const router = express.Router();
const voucherController = require('../controller/voucher'); // Tự động tìm đến file index.js

const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");




// Route cho User kiểm tra mã
router.post("/check", protect, voucherController.checkvoucher);



// Route cho Admin quản lý
router.use(protect, restrictTo("admin"));
router.post("/create", voucherController.createvoucher);
router.patch("/lock/:id", voucherController.lockvoucher);

module.exports = router;

