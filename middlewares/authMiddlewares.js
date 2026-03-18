const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // lay token tu header ( Dung cho Fluter) hoac Cookie (cho web)

  // 1. Kiểm tra Header (Ưu tiên)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // 2. Kiểm tra Cookie (Tên cookie phải chuẩn là Authorization)
  else if (req.cookies && req.cookies.Authorization) {
    let authCookie = req.cookies.Authorization;

    // Giải mã %20 thành dấu cách nếu có
    authCookie = decodeURIComponent(authCookie);

    // Nếu cookie chứa cả chữ "Bearer ", ta cắt lấy phần sau
    if (authCookie.startsWith("Bearer ")) {
      token = authCookie.split(" ")[1];
    } else {
      token = authCookie; // Trường hợp cookie chỉ chứa mỗi chuỗi JWT
    }
  }

  if (!token) {
    return next(
      new AppError("Ban Chua Dang Nhap, Vui long dang nhap de truy cap!", 401),
    );
  }

  // giai ma token kiem tra

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  // kiem tra user ton tai hay khong

  const currentUser = await User.findById(decoded.userId);

  if(currentUser.isActive === false){  
    return next( new AppError('Tai khoan cua ban da bi khoa , vui long lien he admin',401));
  }

  if (!currentUser) {
    return next(
      new AppError(
        "Nguoi dung token nay khong ton tai , du lieu khong khop",
        401,
      ),
    );
  }

  // luu thong tin user vao request

  req.user = currentUser;
  next();
});
