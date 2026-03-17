const express = require("express");
const router = express.Router();
const profileController = require('../controller/profile'); 
const { protect } = require("../middlewares/authMiddlewares");



router.use(protect)
router.get('/profile', profileController.getprofile);
router.patch('/update-profile',profileController.updateprofile);



module.exports = router;