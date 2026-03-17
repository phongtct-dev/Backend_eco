const express = require("express");
const router = express.Router();
const cartController = require('../controller/cart'); // Tự động tìm đến file index.js

const { protect } = require("../middlewares/authMiddlewares");


router.use(protect)

router.get('/',cartController.getcart);
router.post('/',cartController.additem);
//Body: { "productId": "ID_SP", "quantity": 2 }
router.patch('/',cartController.updateitem);
router.delete('/:productId',cartController.removeitem);


module.exports = router;