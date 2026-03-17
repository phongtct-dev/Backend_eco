const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");

// 1. Lấy giỏ hàng (Nếu chưa có thì tạo mới)
exports.getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price salePrice discountPercent discountStart discountEnd isOnSale stock images",
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// 2. Thêm sản phẩm vào giỏ
exports.addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Sản phẩm không tồn tại", 404);
  
  // Ràng buộc số lượng tồn kho
  if (quantity > product.stock) {
    throw new AppError(`Chỉ còn ${product.stock} sản phẩm trong kho`, 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    // Nếu có rồi thì tăng số lượng
    const newQuantity = cart.items[itemIndex].quantity + quantity;
    if (newQuantity > product.stock) throw new AppError("Vượt quá số lượng tồn kho", 400);
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    // Nếu chưa có thì thêm mới
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return this.getCart(userId); // Trả về cart kèm populate
};

// 3. Cập nhật số lượng (dùng cho nút tăng/giảm ở UI)
exports.updateQuantity = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (quantity > product.stock) throw new AppError("Vượt quá số lượng trong kho", 400);

  const cart = await Cart.findOneAndUpdate(
    { user: userId, "items.product": productId },
    { $set: { "items.$.quantity": quantity } },
    { new: true }
  ).populate("items.product");

  return cart;
};

// 4. Xóa 1 sản phẩm khỏi giỏ
exports.removeFromCart = async (userId, productId) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true }
  ).populate("items.product");
};