const express = require("express");
const router = express.Router();
const orderController = require('../controller/order'); // Tự động tìm đến file index.js
const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");




router.use(protect);




router.post("/checkout", orderController.createorder); // Đặt hàng
router.get("/my-orders", orderController.getmyorders); // Xem lịch sử (APIFeatures)
router.get("/:id", orderController.getorderdetails);   // Xem chi tiết

// --- Routes cho Admin/Staff/Shipper ---
router.patch(
  "/update-status/:id", 
  restrictTo("admin", "staff", "shipper"), 
  orderController.updateorderstatus
);

router.get(
  "/admin/all", 
  restrictTo("admin", "staff"), 
  orderController.getallorders
); // Xem toàn bộ đơn (APIFeatures)

module.exports = router;




