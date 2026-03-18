const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const transport = require("../config/sendMail");

exports.signup = async (body) => {
  const { fullName, email, password } = body;

  //1 kiem tra email da ton tai
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email nay da ton tai, vui long dung email khac!", 400);
  }

  //2 hash mat khau
  const hashedPassword = await doHash(password, 12);

  //3 tao User moi
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  const result = await newUser.save();

  //4 Tra ve ket qua (che dau password)
  result.password = undefined;
  return result;
};

exports.signin = async (body) => {
  const { email, password } = body;

  //1 kiem tra
  
  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    throw new AppError("User khong ton tai!", 401);
  }

  const result = await doHashValidation(password, existingUser.password);

  if (!result) {
    throw new AppError("Thong tin dang nhap hoac mat khau khong dung!", 401);
  }

  // 2 Access token (8h)
  const accessTokenExpiresIn = "8h";
  const accessToken = jwt.sign(
    {
      userId: existingUser._id,
      email: existingUser.email,
      verified: existingUser.verified,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: accessTokenExpiresIn,
    },
  );

  const refreshTokenExpiresIn = "30d";
  const refreshToken = jwt.sign(
    { userId: existingUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: refreshTokenExpiresIn,
    },
  );

  return {
    status:(200),
    message: "Dang Nhap Thanh Cong",
    user: {
        id:existingUser._id,
        fullName: existingUser.fullName,
        email:existingUser.email,
        role: existingUser.role,
        verified: existingUser.verified,
    },
    accessToken,
    expiresIn: accessTokenExpiresIn,
    refreshToken,
    refreshTokenExpiresIn: refreshTokenExpiresIn,
  };
};

// Ham refreshToken (moi nhat)

exports.refreshToken = async (refreshTokenFromCookie) => {
  // kiem tra token co ton tai hay khong
  if (!refreshTokenFromCookie) {
    throw new AppError("Khong co refresh token, vui long dang nhap lai", 401);
  }

  try {
    const decoded = jwt.verify(
      //kiểm tra token có hợp lệ hay không.
      refreshTokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded.userId); // Tim user trong MongoDB theo _id lay tu token da decode

    if (!user) {
      throw new AppError("User khong ton tai", 401);
    }

    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        verified: user.verified,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "8h",
      },
    );

    return {
      status: 200,
      success: true,
      accessToken: newAccessToken,
      message: "Token da duoc cap moi thanh cong",
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(
        "Refresh Token da het han.Vui long dang nhap lai!",
        401,
      );
    }

    throw new AppError("Token khong hop le", 401);
  }
};

exports.signout = async () => {
  return {
    status: 200,
    success: true,
    message: "Dang Xuat Thanh Cong",
  };
};

// export const getUserByEmail = async (req,res) => {

// }

exports.sendVerificationCode = async (email) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError("Nguoi dung khong ton tai tren he thong", 404);
  }

  if (existingUser.verified) {
    throw new AppError("Tai khoan da duoc xac minh!!!", 400);
  }

  const codeValue = Math.floor(100000 + Math.random() * 90000).toString();

  const info = await transport.sendMail({
    from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    to: existingUser.email,
    subject: "Ma Xac thuc tai khoan cua ban ",
    html: `<h1>Ma Xac thuc tai khoan cua ban la: ${codeValue}</h1>
                   <p>Mã này sẽ hết hạn sau 5 phút.</p>`,
  });

  if (!info.accepted.includes(existingUser.email)) {
    throw new AppError("Gui ma xac minh that bai!Vui long thu lai", 500);
  }

  if (info.accepted[0] === existingUser.email) {
    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET,
    );

    existingUser.verificationCode = hashedCodeValue;
    existingUser.verificationCodeValidation = Date.now();
    await existingUser.save();

    return true;
  }
};

exports.verifyVerificationCode = async (email, providedCode) => {
  const existingUser = await User.findOne({ email }).select(
    "+verificationCode +verificationCodeValidation",
  );

  if (!existingUser) {
    throw new AppError("Nguoi dung khong ton tai", 404);
  }

  if (existingUser.verified) {
    throw new AppError("Tai khoan da duoc xac minh", 400);
  }

  if (
    !existingUser.verificationCode ||
    !existingUser.verificationCodeValidation
  ) {
    throw new AppError("Khong tim thay yeu cau xac minh", 400);
  }

  const isExpired =
    Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000;

  if (isExpired) {
    throw new AppError("Ma xac minh da het han, vui long lay ma moi", 400);
  }

  // hash ma nguoi dung de so sanh
  const hashedProvidedCode = hmacProcess(
    providedCode.toString(),
    process.env.HMAC_VERIFICATION_CODE_SECRET,
  );

  if (hashedProvidedCode !== existingUser.verificationCode) {
    throw new AppError("Ma xac minh khong chinh xac", 400);
  }

  /// cap nhat trang thai thanh cong
  ((existingUser.verified = true),
    (existingUser.verifyVerificationCode = undefined)); // Xóa mã sau khi dùng xong
  existingUser.verificationCodeValidation = undefined; //// Xóa thời gian sau khi dùng xong
  await existingUser.save();

  return true;
};

/////////////////
// Quen MK , nhung con trong dang Nhap. Thay doi Mk

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const existingUser = await User.findById(userId).select("+password");

  // kiem tra nguoi dung
  if (!existingUser) {
    throw new AppError("Nguoi dung khong ton tai", 404);
  }

  // kiem tra mat khau
  const result = await doHashValidation(oldPassword, existingUser.password);

  if (!result) {
    throw new AppError("Mat khau cu cua ban khong chinh xac", 401);
  }

  existingUser.password = await doHash(newPassword, 12);
  await existingUser.save();
  return true;
};

/// Gui ma tim lai Mk
exports.sendForgotPasswordCode = async (email) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError("Khong tim thay Nguoi dung voi Email nay!!!", 404);
  }

  const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

  const info = await transport.sendMail({
    from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    to: existingUser.email,
    success: "Ma Khoi phuc mat khau ",
    html: `<h1>  Ma cua ban la : ${codeValue}</h1>`,
  });

  if (!info.accepted.includes(existingUser.email)) {
    throw new AppError("Gui ma khoi phuc ve email That Bai", 500);
  }

  existingUser.forgotPasswordCode = hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET);
  existingUser.forgotPasswordCodeValidation =Date.now();
  await existingUser.save();
};


exports.forgotPasswordCode = async (email , providedCode, newPassword) => {
    const existingUser = await User.findOne({email}).select('+forgotPasswordCode +forgotPasswordCodeValidation');

    if(!existingUser || !existingUser.forgotPasswordCode){
        throw new AppError("yeu cau khong hop le do sai thong tin!!!",400);
    }

    //kiem tra thoi gian het hanj(5p)

    if(Date.now() - existingUser.forgotPasswordCodeValidation > 5* 60 *1000){
        throw new AppError("Ma da qua han 5p", 400)
    }


    // kiem tra ma
    const hashedCode = hmacProcess(providedCode.toString() , process.env.HMAC_VERIFICATION_CODE_SECRET)

    if(hashedCode !== existingUser.forgotPasswordCode){
        throw new AppError("Ma xac nhan khong chinh xac", 400)
    }


    // cap nhat ma moi , xoa ma cu

    existingUser.password = await doHash(newPassword,12);
    existingUser.forgotPasswordCode = undefined,
    existingUser.forgotPasswordCodeValidation = undefined,
    await existingUser.save()
}