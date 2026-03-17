const express = require("express");
const router = express.Router();
const adminController = require('../controller/admin'); // Tự động tìm đến file index.js

const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");



router.use(protect, restrictTo('admin'));

// Quan ly chung (Khach va user)
router.patch('/togglestatus/:id',adminController.togglestatus);


//Nhom khach hang


router.get("/users", adminController.getallcustomers);

// voi http://localhost:8000/api/admin/users?role=staff

// --- NHÓM TAO NHÂN VIÊN (SHIPPER) ---

router.post('/employees',adminController.createemployee);


/// Nhóm quản lý kho 

router.get("/inventory-stats", adminController.getinventorystats);

// 3. Quản lý Doanh thu ( Ngày/Tháng/Năm/Top User)
router.get("/revenue-stats", adminController.getrevenuestats);

/// top san pham
router.get("/product-performance", adminController.getproductstats);

module.exports = router;