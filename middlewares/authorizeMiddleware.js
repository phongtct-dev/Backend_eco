
const AppError = require("../utils/appError");
const User = require("../models/userModel");


exports.restrictTo = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            return next(new AppError ('Ban Khong Du Quyen Thuc Hien!!!',403))
        }

        next();
    }
}