const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');




// 1 lay danh sanh nguoi dung theo Role ( Dung cho khach / nhan vien)

exports.getUsersByRole = async ( APIFeatures) => {
    //
    const users = await APIFeatures.query;
    return users;
}


// 2 Khoa / Mo khoa tai khoan

exports.toggleUserStatus = async (userId) => {
    const user = await User.findById(userId);
    if(!user) throw new AppError('Khong tim thay nguoi dung ',404);

   user.isActive = !user.isActive; // Dao nguoc trang thai
   await user.save({validateBeforeSave: false});
   return user;

};

// 3 Tao tai khoan Nhan vien / Shipper (Admin tao)
exports.createEmployee = async (data) => {
    const {fullName, email, password, role} = data;


    // Kiem tra email ton tai
    const existingUser = await User.findOne({email});
    if(existingUser) throw new AppError('email da ton tai!!!',400);

    return await User.create({
        fullName,
        email,
        password,
        role,
        verified:true,// damin tao nen mac dinh da xac thuc
        isActive:true// admin tao nen mac dinh hoat dong duoc
    })
}