const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

/**
 * 1. TẠO SẢN PHẨM MỚI
 */
exports.createProduct = async (body, files) => {
    // a. Kiểm tra danh mục tồn tại
    const category = await Category.findById(body.category);
    if (!category) throw new AppError('Danh mục không tồn tại', 400);

    // b. Xử lý upload mảng ảnh 
    let imagesData = [];
    if (files && files.length > 0) {
        // Sử dụng Promise.all để upload đồng thời (nhanh hơn vòng lặp thường)
        imagesData = await Promise.all(
            files.map(async (file) => {
                const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const result = await uploadImage(fileBase64, 'products');
                return {
                    url: result.url,
                    public_id: result.public_id
                };
            })
        );
    }

    // c. Tạo bản ghi trong DB
    const newProduct = await Product.create({
        ...body,
        images: imagesData
    });

    // d. Cập nhật số lượng sản phẩm của danh mục (tùy chọn)
    await Category.findByIdAndUpdate(body.category, { $inc: { productCount: 1 } });

    return newProduct;
};

/**
 * 2. LẤY DANH SÁCH (Sẽ dùng APIFeatures ở Controller)
 */
exports.getAllProducts = async (apiFeatures) => {
    // Thực thi query từ APIFeatures và populate thông tin Category
    const products = await apiFeatures.query.populate({
        path: 'category',
        select: 'name'
    });
    return products;
};

/**
 * 3. CẬP NHẬT SẢN PHẨM
 */
exports.updateProduct = async (id, body, files) => {
    const product = await Product.findById(id);
    if (!product) throw new AppError('Không tìm thấy sản phẩm', 404);

    const updateData = { ...body };

    // Nếu có upload ảnh mới
    if (files && files.length > 0) {
        // Xóa ảnh cũ trên Cloudinary
        if (product.images.length > 0) {
            await Promise.all(product.images.map(img => deleteImage(img.public_id)));
        }

        // Upload ảnh mới
        updateData.images = await Promise.all(
            files.map(async (file) => {
                const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const result = await uploadImage(fileBase64, 'products');
                return { url: result.url, public_id: result.public_id };
            })
        );
    }

    return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

/**
 * 4. XÓA SẢN PHẨM (Xóa mềm)
 */
exports.deleteProduct = async (id) => {
    const product = await Product.findByIdAndUpdate(id, { isDeleted: true });

    

    if (!product){ 
        throw new AppError('Không tìm thấy sản phẩm', 404);}

    if(product.stock > 0 ){
        throw new AppError('Khong duoc xoa san pham khi ,ton kho con!!!!',400)
    }
    
    // Giảm số lượng sản phẩm trong Category
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    
    return null;
};



///Sản phẩm tương tự
exports.getRelatedProducts = async (productId, categoryId) => {
    return await Product.find({
        category: categoryId,
        _id: { $ne: productId }, // Loại bỏ chính sản phẩm đang xem
        isDeleted: false
    })
    .limit(4) // Lấy 4 sản phẩm thôi
    .select('name price images');
};


/**
 * LẤY CHI TIẾT SẢN PHẨM THEO ID
 */
exports.getProductById = async (id) => {
    const product = await Product.findOne({ _id: id, isDeleted: false })
        .populate({
            path: 'category',
            select: 'name slug' // Chỉ lấy tên và slug của danh mục
        });

    if (!product) {
        throw new AppError('Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa', 404);
    }

    return product;
};
///


// 1. Tạo hoặc Cập nhật khuyến mãi
exports.updateProductPromotion = async (productId, promoData) => {
    const { discountPercent, discountStart, discountEnd } = promoData;

    const product = await Product.findById(productId);
    if (!product) throw new AppError("Sản phẩm không tồn tại", 404);

    // Cập nhật các trường thông tin
    product.discountPercent = discountPercent;
    product.discountStart = new Date(discountStart);
    product.discountEnd = new Date(discountEnd);

    // Save sẽ kích hoạt Middleware pre("save") để tự tính salePrice và bật isOnSale
    await product.save();
    return product;
};


/// 

// 2. Kết thúc khuyến mãi sớm
exports.endPromotionEarly = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Sản phẩm không tồn tại", 404);

    product.discountPercent = 0;
    product.isOnSale = false;
    product.discountStart = undefined;
    product.discountEnd = undefined;
    product.salePrice = 0;

    await product.save();
    return product;
};