const cloudinary = require("../config/cloudinary");
const streamifier = require('streamifier');

const uploadImage = async (fileSource, folder = "general") => {
  try {
    // TRƯỜNG HỢP 1: Nếu fileSource là Buffer (Dùng cho MemoryStorage - Profile)
    if (Buffer.isBuffer(fileSource)) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `backend_eco/${folder}` },
          (error, result) => {
            if (result) resolve({ url: result.secure_url, public_id: result.public_id });
            else reject(error);
          }
        );
        streamifier.createReadStream(fileSource).pipe(stream);
      });
    }

    // TRƯỜNG HỢP 2: Nếu fileSource là String (Dùng cho DiskStorage - Product cũ)
    const result = await cloudinary.uploader.upload(fileSource, {
      folder: `backend_eco/${folder}`,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw error;
  }
};

const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Lỗi xảy ra khi xóa ảnh:", error);
  }
};

module.exports = { uploadImage, deleteImage };