const express = require("express");
const router = express.Router();
const authController = require('../controller/auth'); // Tự động tìm đến file index.js
const { protect } = require("../middlewares/authMiddlewares");

router.post('/sign-up',authController.signup);
router.post('/verify-verification-code',authController.verifyverificationcode);
router.post('/send-verification-code',authController.sendverificationcode);

router.post('/send-forgot-password-code',authController.sendforgotpasswordcode);
router.patch('/forgot-password-code',authController.forgotpasswordcode);
router.post('/sign-in',authController.signin);
router.post('/sign-out',authController.signout);

router.use(protect)
router.post('/refresh-token',authController.refreshtoken);
router.patch('/change-password',authController.changepassword);





module.exports = router;