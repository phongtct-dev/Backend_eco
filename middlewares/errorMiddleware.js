const globalErrorHandler = (err, req, res, next) => { // Hàm xử lý lỗi toàn cục
    err.statusCode = err.statusCode || 500;// Nếu không có mã lỗi thì mặc định 500
    err.status = err.status || 'error'; //err chưa có thuộc tính status, thì gán cho nó giá trị mặc định là 'error'


    // MÔI TRƯỜNG DEVELOPMENT 

    if(process.env.NODE_ENV === 'development'){ // Đang code → muốn thấy hết lỗi
        return res.status(err.statusCode)
                .json({
                    status: err.status,
                    error: err,
                    message: err.messsage,
                    stack: err.stack, // Hiện dòng code nào bị lỗi
                });
    }

    // MÔI TRƯỜNG PRODUCTION

    if(err.isOperational){
        return res.status(err.statusCode).json({  // Lỗi do TA throw (AppError)
            status: err.status,
            messsage: err.messsage,  // Chỉ hiện thông báo 
        });
    }


    console.error('ERROR',err); // Ghi log lỗi thật (bug server)
    

    return res.status(500).json({
        status:'error',
        messsage:'Da xay ra Loi Nghiêm Trong!!! Thu lai sau'
    });
}

module.exports = globalErrorHandler