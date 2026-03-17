const express = require("express");
const router = express.Router();
const categoryController = require('../controller/category'); // Tự động tìm đến file index.js
const { protect } = require("../middlewares/authMiddlewares");
const { restrictTo } = require("../middlewares/authorizeMiddleware");
const upload = require("../middlewares/multer");



router.get('/',categoryController.getallcategories);
router.get('/:id',categoryController.getcategory);


router.use(protect, restrictTo('admin'));
router.post('/', upload.single('image'),categoryController.createcategory);
router.patch('/:id', upload.single('image'),categoryController.updatecategory);

router.delete('/:id',categoryController.deletecategory);

module.exports = router;