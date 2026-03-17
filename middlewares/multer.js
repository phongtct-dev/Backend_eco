const multer = require('multer');
const AppError = require('../utils/appError');




/// luu file vao bo nho (Memory Storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Khong phai tep anh!Vui long chi tai len hinh anh.', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 4 * 1024 * 1024 } //Gioi han 4MB
});

module.exports = upload;