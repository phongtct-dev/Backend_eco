const transport = require("../config/sendMail");
const AppError = require("../utils/appError");



exports.sendOrderSuccessEmail = async (userEmail, order) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const voucher = order.voucher || {};

  const totalProductPrice = Number(order.totalProductPrice || 0);
  const discountAmount = Number(voucher.discountAmount || 0);
  const finalAmount = Number(order.finalAmount || 0);

  // Tạo HTML cho từng sản phẩm có ảnh
  const itemsHtml = items
    .map((item) => {
      let imageUrl = "https://via.placeholder.com/150x150?text=No+Image";

      // Lấy ảnh từ product đã populate
      if (item.product?.images?.length > 0) {
        imageUrl = item.product.images[0].url || item.product.images[0];
      }

      const price = Number(item.salePrice || item.price || 0);

      return `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 70px;">
            <img src="${imageUrl}" 
                 alt="${item.name}" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">
            <strong>${item.name || "Sản phẩm"}</strong>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity || 1}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: right;">
            ${price.toLocaleString('vi-VN')}đ
          </td>
        </tr>`;
    })
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #2ecc71, #27ae60); padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">✅ Thanh toán thành công!</h1>
        <p style="margin: 8px 0 0 0;">Đơn hàng #${order._id}</p>
      </div>

      <div style="padding: 25px;">
        <p>Xin chào,</p>
        <p>Đơn hàng của bạn đã được xác nhận và thanh toán thành công qua Stripe.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; width: 70px;"></th>
              <th style="padding: 12px; text-align: left;">Sản phẩm</th>
              <th style="padding: 12px; text-align: center;">SL</th>
              <th style="padding: 12px; text-align: right;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; background: #f9f9f9; padding: 18px; border-radius: 10px; margin: 20px 0;">
          <p>Tổng tiền hàng: <strong>${totalProductPrice.toLocaleString('vi-VN')}đ</strong></p>
          ${discountAmount > 0 ? `<p style="color: #e74c3c;">Giảm giá voucher: -${discountAmount.toLocaleString('vi-VN')}đ</p>` : ""}
          <h3 style="color: #2c3e50;">Tổng thanh toán: ${finalAmount.toLocaleString('vi-VN')}đ</h3>
        </div>

        <div style="background: #f9f9f9; padding: 18px; border-radius: 10px;">
          <p style="font-weight: bold;">📍 Địa chỉ nhận hàng:</p>
          <p>${order.shippingAddress?.fullName || "Khách hàng"} — ${order.shippingAddress?.phone || ""}</p>
          <p>${order.shippingAddress?.address || "Chưa cập nhật"}</p>
        </div>

        <p style="text-align: center; color: #7f8c8d; margin-top: 30px;">
          Cảm ơn bạn đã mua sắm tại EcoShop ❤️
        </p>
      </div>
    </div>
  `;

  await transport.sendMail({
    from: `"EcoShop Support" <${process.env.NODE_CODE_SENDING_EMAIL_ADDRESS}>`,
    to: userEmail,
    subject: `✅ Xác nhận thanh toán thành công - Đơn hàng #${order._id}`,
    html: htmlContent,
  });

  console.log(`✅ Email có ảnh / đã gửi tới: ${userEmail}`);
};