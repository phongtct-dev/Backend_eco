const transport = require("../config/sendMail");
const AppError = require("../utils/appError");



exports.sendOrderSuccessEmail = async (userEmail, order) => {
  // Tạo danh sách sản phẩm dưới dạng bảng HTML
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.salePrice.toLocaleString()}đ</td>
    </tr>`
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #2ecc71; text-align: center;">Thanh toán thành công!</h2>
      <p>Xin chào, đơn hàng <strong>#${order._id}</strong> của bạn đã được xác nhận.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Sản phẩm</th>
            <th style="padding: 10px; border-bottom: 2px solid #ddd;">SL</th>
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; line-height: 1.6;">
        <p>Tổng tiền hàng: ${order.totalProductPrice.toLocaleString()}đ</p>
        ${order.voucher ? `<p style="color: #e74c3c;">Giảm giá (Voucher): -${order.voucher.discountAmount.toLocaleString()}đ</p>` : ""}
        <h3 style="color: #2c3e50;">Tổng thanh toán: ${order.finalAmount.toLocaleString()}đ</h3>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin: 0;"><strong>Địa chỉ nhận hàng:</strong></p>
        <p style="margin: 5px 0;">${order.shippingAddress.fullName} - ${order.shippingAddress.phone}</p>
        <p style="margin: 0;">${order.shippingAddress.address}</p>
      </div>

      <p style="font-size: 12px; color: #7f8c8d; text-align: center; margin-top: 30px;">
        Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
      </p>
    </div>
  `;

  await transport.sendMail({
    from: `"EcoShop Support" <${process.env.NODE_CODE_SENDING_EMAIL_ADDRESS}>`,
    to: userEmail,
    subject: `Xác nhận đơn hàng #${order._id} đã thanh toán thành công`,
    html: htmlContent,
  });
};