const express = require("express");
const router = express.Router();
const reviewController = require("../controller/review");
const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");




// Xem review thì ai cũng xem được
router.get("/product/:productId", reviewController.getproductreviews);

// Phải login mới được review
router.use(protect);

router.post("/", reviewController.createreview);

// Admin & Staff quản lý
router.patch("/toggle/:id", restrictTo("admin", "staff"), reviewController.togglereview);
router.get("/admin/all", restrictTo("admin", "staff"), reviewController.getallreviews);

module.exports = router;

