const Joi = require('joi');


exports.signupSchema = Joi.object({
    fullName: Joi.string()
    .min(2)
    .max(50)
    .pattern(new RegExp('^[a-zA-ZÀ-ỹ\\s]+$')) // Chỉ cho phép chữ cái và khoảng trắng
    .required('Vui long nhap ho va ten'), 
    email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
        tlds:{allow:['com','net']}// yêu cầu phép TLD hợp lệ
    }),
    password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))//biêu thức chính quy để ,Có chữ thường,Có chữ hoa,Có số,Tối thiểu 8 ký tự
})

exports.signinSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
        tlds:{allow:['com','net']}// yêu cầu phép TLD hợp lệ
    }),
    password: Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))//biêu thức chính quy để ,Có chữ thường,Có chữ hoa,Có số,Tối thiểu 8 ký tự
})



exports.acceptCodeSchema = Joi.object({
    email: Joi.string().min(6).max(60).required()
    .email({
            tlds:{allow:['com','net']}// yêu cầu phép TLD hợp lệ
    }),
    providedCode: Joi.number().required()
});


exports.changePasswordSchema = Joi.object({
    newPassword: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')),
    oldPassword: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
})

exports.acceptFPCodeSchema = Joi.object({
    email: Joi.string().min(6).max(60).required()
    .email({
            tlds:{allow:['com','net']}// yêu cầu phép TLD hợp lệ
    }),
    newPassword: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')),
    providedCode: Joi.number().required(),
})