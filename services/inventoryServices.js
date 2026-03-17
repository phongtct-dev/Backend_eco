/// Quản lý kho 
const Product = require("../models/productModel");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");


exports.getInventoryStats = async () => {
  const stats = await Product.aggregate([
    {
      // Chỉ lấy các sản phẩm chưa bị xóa
      $match: { isDeleted: false }
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStock: { $sum: "$stock" },
        totalSold: { $sum: "$sold" },
        // Lấy danh sách sản phẩm sắp hết hàng (stock < 5)
        lowStockItems: {
          $push: {
            $cond: [{ $lt: ["$stock", 5] }, { name: "$name", stock: "$stock", sku: "$sku" }, "$$REMOVE"]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalProducts: 1,
        totalStock: 1,
        totalSold: 1,
        lowStockCount: { $size: "$lowStockItems" },
        lowStockItems: 1
      }
    }
  ]);

  // Thống kê theo danh mục (Category)
  const categoryStats = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$category",
        categoryName: { $first: "$brand" }, // Tạm thời lấy brand hoặc bạn có thể populate sau
        stock: { $sum: "$stock" },
        sold: { $sum: "$sold" },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "categories", // Tên collection danh mục trong DB
        localField: "_id",
        foreignField: "_id",
        as: "categoryDetail"
      }
    },
    { $unwind: "$categoryDetail" },
    {
      $project: {
        _id: 1,
        name: "$categoryDetail.name",
        stock: 1,
        sold: 1,
        productCount: "$count"
      }
    }
  ]);

  return {
    overview: stats[0] || { totalProducts: 0, totalStock: 0, totalSold: 0, lowStockCount: 0, lowStockItems: [] },
    byCategory: categoryStats
  };
};


exports.getProductPerformStats = async (limitValue = 10) => {
  const limit = limitValue * 1;

  // 1. Top sản phẩm bán chạy nhất & Doanh thu cao nhất 
  // (Tính toán dựa trên thực tế đơn hàng thành công)
  const productStats = await Order.aggregate([
    { 
      $match: { $or: [{ paymentStatus: "PAID" }, { status: "SUCCESS" }] } 
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        totalSold: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.salePrice", "$items.quantity"] } }
      }
    },
    {
      $facet: {
        topSelling: [{ $sort: { totalSold: -1 } }, { $limit: limit }],
        topRevenue: [{ $sort: { totalRevenue: -1 } }, { $limit: limit }]
      }
    }
  ]);

  // 2. Sản phẩm bán chậm nhất (Option B: Stock cao - Sold thấp)
  // Dựa trên dữ liệu trực tiếp từ Product Model
  const slowSelling = await Product.find({ isDeleted: false })
    .sort({ sold: 1, stock: -1 }) // Bán ít nhất, tồn nhiều nhất lên đầu
    .limit(limit)
    .select("name sku stock sold price");

  return {
    topSelling: productStats[0].topSelling,
    topRevenue: productStats[0].topRevenue,
    slowSelling
  };
};