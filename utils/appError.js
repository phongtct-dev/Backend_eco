class AppError extends Error {
    constructor (message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail' : 'error';
        this.isOperational = true;// Đánh dấu lỗi này do TA dự đoán được (không phải bug server)
        Error.captureStackTrace(this,this.constructor);//Lưu vết lỗi để debug
    }
}

module.exports = AppError;