const Order = require("../models/orderModel");
const mongoose = require("mongoose");

exports.getRevenueStats = async (query) => {
  const { year, month, startDate, endDate } = query;

  // 1. Tạo bộ lọc thời gian
  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
  } else {
    const targetYear = year * 1 || new Date().getFullYear();
    const start = new Date(`${targetYear}-01-01`);
    const end = new Date(`${targetYear}-12-31T23:59:59`);
    dateFilter = { createdAt: { $gte: start, $lte: end } };
  }

  // 2. Aggregation tổng hợp Doanh thu
  const stats = await Order.aggregate([
    {
      $match: {
        $or: [{ paymentStatus: "PAID" }, { status: "SUCCESS" }],
        ...dateFilter
      }
    },
    {
      $unwind: "$items" // Bóc tách từng item để tính doanh thu theo sản phẩm/giá gốc
    },
    {
      $group: {
        _id: null,
        totalOriginalPrice: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        totalSalePrice: { $sum: { $multiply: ["$items.salePrice", "$items.quantity"] } },
        // Vì unwind làm nhân đơn hàng lên, nên tính voucher và thực tế bằng cách group theo đơn hàng trước đó 
        totalVoucher: { $addToSet: { orderId: "$_id", discount: "$voucher.discountAmount" } },
        actualRevenue: { $addToSet: { orderId: "$_id", amount: "$finalAmount" } }
      }
    },
    {
      $project: {
        _id: 0,
        totalOriginalPrice: 1,
        totalSalePrice: 1,
        totalVoucher: { $sum: "$totalVoucher.discount" },
        actualRevenue: { $sum: "$actualRevenue.amount" }
      }
    }
  ]);

  // 3. Doanh thu theo Time-series (Theo tháng trong năm)
  const timeSeries = await Order.aggregate([
    { $match: { $or: [{ paymentStatus: "PAID" }, { status: "SUCCESS" }], ...dateFilter } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        revenue: { $sum: "$finalAmount" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  // 4. Top 10 khách hàng chi tiêu nhiều nhất
  const topUsers = await Order.aggregate([
    { $match: { $or: [{ paymentStatus: "PAID" }, { status: "SUCCESS" }] } },
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$finalAmount" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 1,
        fullName: "$userInfo.fullName",
        email: "$userInfo.email",
        totalSpent: 1,
        orderCount: 1
      }
    }
  ]);

  return {
    overview: stats[0] || {},
    timeSeries,
    topUsers
  };
};