module.exports = fn =>{ // hàm controller nhận vào 1 asyns
    return (req, res, next) => { // Trả về middleware chuẩn Express
        fn(req,res,next).catch(next); // Chạy hàm, nếu lỗi thì tự động next(err)
    }
}
