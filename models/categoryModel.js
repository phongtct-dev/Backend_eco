const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ten danh muc la bat buoc'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    image: String,
    public_id: String,
    sortOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware tao slug tu dong truoc khi luu
categorySchema.pre('save', function () {
  if (!this.isModified('name')) return;
  this.slug = slugify(this.name, { lower: true, strict: true });
});

// INDEX CHIEN LUOC
// 2. Lay danh sach danh muc dang hoat dong theo thu tu uu tien (Menu)
categorySchema.index({ isDeleted: 1, isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);