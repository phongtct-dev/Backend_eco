const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    sku: {
      type: String,
      required: [true, "Mã SKU là bắt buộc"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Sản phẩm phải thuộc một danh mục"],
    },
    brand: {
      type: String,
      required: [true, "Thương hiệu là bắt buộc"],
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá không được âm"],
    },

    /// Xu ly khuyen mai
    salePrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      // phan tram giam gia
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    discountStart: Date, //Ngay bat dau giam

    discountEnd: Date, // Ngay ket thuc giam gia

    isOnSale: {// trang thai giam gia
      type: Boolean,
      default: false,
    },




    // 

    stock: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      default: 0,
    },
    unit: {
      type: String,
      default: "phan",
      lowercase: true,
      trim: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating tối thiểu là 1"],
      max: [5, "Rating tối đa là 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: String,
    // Cập nhật cấu trúc mảng ảnh để quản lý Cloudinary triệt để
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- MIDDLEWARE ---
productSchema.pre("save", function () {

  ///////
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  

  /// 


  // Tự động tính toán Khuyến mãi
  if (this.isModified("discountPercent") || this.isModified("price")) {
    if (this.discountPercent > 0) {
      this.salePrice = this.price * (1 - this.discountPercent / 100);
      this.isOnSale = true;
    } else {
      // Nếu discountPercent = 0, xóa bỏ trạng thái sale
      this.salePrice = 0;
      this.isOnSale = false;
      this.discountStart = undefined;
      this.discountEnd = undefined;
    }
  }

  // Tự động bật isOnSale nếu có giá giảm và có thời hạn
  if (this.salePrice > 0 && this.salePrice < this.price) {
    this.isOnSale = true;
  } else {
    this.isOnSale = false;
  }



});

// --- VIRTUALS CHO THÔNG BÁO (Giá cũ, Giá mới, % Giảm) ---
productSchema.virtual('finalPrice').get(function () {
  const now = new Date();
  if (this.isOnSale && this.discountStart <= now && this.discountEnd >= now) {
    return this.salePrice;
  }
  return this.price;
});


///




// Kiểm tra xem sản phẩm có thực sự đang trong đợt Sale không
productSchema.virtual('isPromotionActive').get(function() {
    const now = new Date();
    return this.isOnSale && this.discountStart <= now && this.discountEnd >= now;
});


// --- INDEX CHIẾN LƯỢC ---

// 1. Text Index: Cho phép tìm kiếm nâng cao trên nhiều trường
// Trọng số (weights): Ưu tiên kết quả khớp ở 'name' hơn 'brand'
productSchema.index(
  { name: "text", brand: "text", description: "text" },
  { weights: { name: 10, brand: 5, description: 1 }, name: "ProductTextIndex" },
);

// 2. Composite Index cho Bộ lọc (Filter)
productSchema.index({ category: 1, isDeleted: 1, price: 1 });

// 3. Index cho các tác vụ sắp xếp phổ biến
productSchema.index({ sold: -1 });
productSchema.index({ createdAt: -1 });


// 4. khuyen mai
productSchema.index({ isOnSale: 1 });
productSchema.index({ discountEnd: 1 });

module.exports = mongoose.model("Product", productSchema);

