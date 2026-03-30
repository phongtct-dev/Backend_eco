const express = require ('express');

const helmet = require('helmet');// Bảo mật HTTP headers
const cors = require('cors');// Cho phép frontend gọi API
const cookieParser = require('cookie-parser');// Đọc cookie
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

const authRouter = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
const adminRouter = require('./routers/adminRouter');

const promotionRouter = require('./routers/promotionRouter');

const cartRouter = require('./routers/cartRouter');

const voucherRouter = require('./routers/voucherRouter');

const orderRouter = require('./routers/orderRouter');

const orderController = require('./controller/orderController');

const reviewRouter = require('./routers/reviewRouter');


const app = express();


// 1. ĐẶT WEBHOOK (TRƯỚC express.json())
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }), 
 orderController.webhookCheckout
);

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173", // frontend
    credentials: true, // cho phép gửi cookie 
    }
));
app.use(cookieParser());
app.use(express.json());// Parse JSON từ request body
app.use(express.urlencoded({ extended: true }));// dung de parse form data xu ly du lieu tu form gui len de su dung cho viec req.body cua express

// Sử dụng Router
app.use('/api/auth',authRouter);
app.use('/api/profile',profileRouter);
app.use('/api/category',categoryRouter);
app.use('/api/product',productRouter);
app.use('/api/admin',adminRouter);

app.use('/api/promotions',promotionRouter);

app.use('/api/cart',cartRouter);

app.use('/api/voucher',voucherRouter);

app.use('/api/order',orderRouter);

app.use('/api/review',reviewRouter);



// Route không tồn tại chuyển về 404
app.use((req,res,next) => {
    next(new AppError(`Khong tim thay router ${req.originalUrl} tren server nay!!!`,404))
});

// dung Error handler , hung loi cuoi
app.use(globalErrorHandler)

module.exports = app;