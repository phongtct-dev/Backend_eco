const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
    fullName: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[\p{L}\s]+$/u)
        .messages({
            'string.min': 'Ho va ten phai co it nhat 2 ky tu',
            'string.max': 'Ho va ten toi da 50 ky tu',
            'string.pattern.base': 'Ho va ten chi duoc chua chu cai va khoang trang'
        })
        .optional(),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'So dien thoai phai co dung 10 chu so'
        })
        .optional(),

    address: Joi.string()
        .max(200)
        .trim()
        .optional(),

    avatar: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .messages({
            'string.uri': 'Avatar phai la duong dan URL hop le'
        })
        .optional()
})
.min(1)
.messages({
    'object.min': 'Vui long cap nhat it nhat mot thong tin'
});