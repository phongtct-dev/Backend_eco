const express = require("express");
const router = express.Router();
const profileController = require('../controller/profile'); 
const { protect } = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/multer");



router.use(protect)
router.get('/profile', profileController.getprofile);
router.patch('/update-profile', upload.single('avatar'), profileController.updateprofile);



module.exports = router;