mở cmd 
chạy lệnh:

stripe listen --forward-to localhost:8000/webhook-checkout



/// nhớ chuyển trong
 file  orderServices.js(hướng trang về khi báo thành công)


mode: 'payment',

      // // Đổi URL chuyển hướng về Web
      // success_url: `${process.env.CLIENT_URL}/order/success/${newOrder._id}`,
      // cancel_url: `${process.env.CLIENT_URL}/checkout`,

      // Đổi URL chuyển hướng về Custom Scheme của App Flutter
      success_url: `ecoapp://app/order-success`, 
      cancel_url: `ecoapp://app/checkout`,