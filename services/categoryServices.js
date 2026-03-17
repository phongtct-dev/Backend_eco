const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

exports.createCategory = async (body, file) => {
  const { name, description } = body;

  //1 kiem tra ten danh muc khong duoc trung
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new AppError("Ten danh muc da ton tai", 400);
  }

  //2 Xu li anh
  let imageData = {};
  if (file) {
    //Chuyen buffer tu multer thanh chuoi base64 de upload

    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploadResult = await uploadImage(fileBase64, "categories");

    imageData.url = uploadResult.url;
    imageData.public_id = uploadResult.public_id;
  } else {
    throw new AppError("Vui long cung cap hinh anh cho danh muc", 400);
  }

  //3 tao ban ghi moi trong Data base
  const newCategory = await Category.create({
    name,
    description,
    image: imageData.url,
    public_id: imageData.public_id,
  });

  return newCategory;
};

//
exports.getAllCategories = async () => {
  // Tu dong loc isDeleted: false
  return await Category.find().sort("sortOrder");
};

// xem chi tiet danh muc
exports.getCategoryById = async (id) => {
    const category = await Category.findById(id);
    if (!category) throw new AppError('Khong tim thay danh muc nay', 404);
    return category;
};

/// Cap nhat danh muc

// 2. Cập nhật Danh mục (Sửa)
exports.updateCategory = async (id, body, file) => {
    const category = await Category.findById(id);
    if (!category){ 
        throw new AppError('Khong tim thay danh muc de cap nhat', 404);}

    const updateData = { ...body };

    // neu co file moi
    if (file) {
        // a. Xoa anh cu Cloudinary
         if (category.public_id) await deleteImage(category.public_id);

        // b. Upload anh moi
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const uploadResult = await uploadImage(fileBase64, 'categories');
        updateData.image = uploadResult.url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    return updatedCategory;
};


// 3. Xoa Danh muc
exports.deleteCategory = async (id) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new AppError('Khong tim thay danh muc de xoa', 404)}

    if(category.productCount > 0){
      throw new AppError('Khong the xoa danh muc khi con san pham', 400)
    }

    // Chuyen trag thai isDeleted  true 
    category.isDeleted = true;
    await category.save();

    return null;
};