const express = require('express');
const router = express.Router();
const productController = require('../controller/product'); // Entry point của folder controller
const upload = require('../middlewares/multer');

const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");




// --- Public Routes ---
router.get('/', productController.getallproduct);
router.get('/:id', productController.getproduct);



router.use(protect, restrictTo('admin'));
// --- Admin Routes 
router.post('/', upload.array('images', 5), productController.createproduct);
router.patch('/:id', upload.array('images', 5), productController.updateproduct);
router.delete('/:id', productController.deleteproduct);

module.exports = router;

