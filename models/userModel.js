const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Ho va Ten la Bat Buoc!!!"],
      trim: true, //loai bo khoang trang o dau va cuoi
    },

    email: {
      type: String,
      required: [true, "Vui long nhap email"],
      unique: [true, "Email da ton tai!!!"],
      minlength: [5, "Email phai co it nhat 5 ki tu!!!"],
      lowercase: true, //chuyen ve chu thuong
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Vui long nhap Mat Khau"],
      minlength: [6, " Password co it nhat 6 ki tu!!!"],
      select: false, //Khi query User, mặc định sẽ không hiện password để bảo mật
      trim: true,
    },

    // thong tin ca nhan user
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    //
    avatar: {
      type: String,
      default: "", // user cũ sẽ không bị lỗi
    },
    //Quyen va Hang
    role: {
      type: String,
      enum: ["guest", "user", "staff", "admin", "shipper"],
      default: "user",
    },
    rank: {
      type: String,
      enum: ["Member", "Silver", "Gold", "Diamond"],
      default: "Member",
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    ///luu tham chieu lich su mua hang

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // ---- khu quan ly Token , ma phuc hoi, ma xac thuc

    refreshToken: {
      type: String,
      default: "",
    },

    verified: {
      //kiem tra tai khoan da duoc xac thuc chua
      type: Boolean,
      default: false, // khi xac thuc thi se doi thanh true
    },
    verificationCode: {
      //ma xac thuc gui ve email nguoi dung
      type: String,
      select: false,
    },

    verificationCodeValidation: {
      //thoi gian ma xac thuc con hieu luc
      type: Number,
      select: false,
    },

    // Lay Mat Khau
    forgotPasswordCode: {
      //ma dat lai mat khau gui ve email nguoi dung
      type: String,
      select: false,
    },

    forgotPasswordCodeValidation: {
      //thoi gian ma dat lai mat khau con hieu luc
      type: Number,
      select: false,
    },

    // Trang thai tai khoang (Soft Delete & Block)

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

// --- Middleware: Tự động cập nhật Rank dựa trên totalSpent trước khi save ---

userSchema.pre("save", function () {
  if (this.isModified("totalSpent")) {
    if (this.totalSpent >= 20000000) {
      this.rank = "Diamond";
    } else if (this.totalSpent >= 10000000) {
      this.rank = "Gold";
    } else if (this.totalSpent >= 5000000) {
      this.rank = "Silver";
    } else {
      this.rank = "Member";
    }
  }
});


// 1. Index cho admin dashboard (query user theo trang thai + role)
userSchema.index({ isDeleted: 1, isActive: 1, role: 1 });

// 2. Index cho phan trang + sort theo tong chi tieu (admin xem top user)
userSchema.index({ totalSpent: -1, _id: 1 });

// 3. Index cho tim kiem user (fullName + email)
userSchema.index({ fullName: "text", email: "text" }, { default_language: "vi" });

module.exports = mongoose.model("User", userSchema);


