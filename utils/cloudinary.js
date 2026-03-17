const cloudinary = require("../config/cloudinary");


/**
 * @param {string} fileContent // duong dan file
 * @param {string} folder - Thu muc tren clou (products, categories, v.v.)
 */
const uploadImage = async (fileContent, folder = "general") => {
  try {
    const result = await cloudinary.uploader.upload(fileContent, {
      folder: `backend_eco/${folder}`, // to chuc thu muc
      resource_type: "auto", // tu dong nhan dien loai file
    });

    return {
      url: result.secure_url,
      public_id: result.public_id, // dung cho delete sau
    };
  } catch (error) {
    
    throw error;
  }
};



/// xoa anh cu sau cap nhat 
const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Loi xay ra khi, xoa anh :", error);
  }
};

module.exports = { uploadImage, deleteImage };