const Product = require('../../../models/productModel');
const productServices = require('../../../services/productServices');
const APIFeatures = require('../../../utils/apiFeatures');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res, next) => {
    
    const countFeatures = new APIFeatures(Product.find({isDeleted:false}), req.query)
            .search()
            .filter();
        
    const totalItems = await countFeatures.query.countDocuments();

    // 1. Khởi tạo APIFeatures
    // Lưu ý: lọc isDeleted: false mặc định
    const features = new APIFeatures(Product.find({ isDeleted: false }), req.query)
        .search()   // Dùng $text search đã sửa
        .filter()   // Lọc gte, lte...
        .sort()     // Sắp xếp
        .limitFields()
        .paginate();

    // 2. Gọi Service xử lý kết quả cuối cùng
    // const products = await productServices.getAllProducts(features);
    
    // 3. Thực thi query qua Service (Có thêm populate)
    const products = await features.query.populate('category', 'name');


    // Thong so phan trang
    const limit = req.query.limit*1 || 10;
    const page = req.query.page * 1 || 1;
    const totalPages = Math.ceil(totalItems / limit);

    // 3. Phản hồi
    sendResponse(res, 200, 'Lay Danh sanh san pham thanh cong', {
        pagination:{
            totalItems,
            totalPages,
            currentPage: page,
            limit
        }
        ,
        results: products.length,
        products
    });
});