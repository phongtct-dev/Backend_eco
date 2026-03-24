class APIFeatures {
  constructor(query, queryString) {
    this.query = query; /// Mogo query
    this.queryString = queryString; //req.query
  }

  //1 Tim kiem theo ten (Search)
  search() {
    if (this.queryString.keyword) {
      // Thay vì find trực tiếp, ta lưu điều kiện search vào một biến
      const searchObj = { $text: { $search: this.queryString.keyword } };
      this.query = this.query.find(searchObj);
      
      // Thêm điểm số tìm kiếm để sort
      this.query = this.query.select({ score: { $meta: "textScore" } });
    }
    return this;
  }

  //2 Bo loc nang cao

filter() {
    const queryObj = { ...this.queryString };
    // THÊM 'isPromotion' vào mảng loại bỏ dưới đây
    const excludedFields = ["page", "sort", "limit", "fields", "keyword", "isPromotion"]; 
    excludedFields.forEach((el) => delete queryObj[el]);

    let finalQuery = {};

    // 1. Xử lý các toán tử [gte], [lte]... (Giữ nguyên logic bóc tách ngoặc vuông)
    for (let key in queryObj) {
        if (key.includes('[') && key.includes(']')) {
            const field = key.split('[')[0];
            let operator = key.match(/\[(.*?)\]/)[1];
            if (!operator.startsWith('$')) operator = `$${operator}`;

            if (!finalQuery[field]) finalQuery[field] = {};
            const val = queryObj[key];
            finalQuery[field][operator] = (isNaN(val) || val === '') ? val : val * 1;
        } else {
            finalQuery[key] = queryObj[key];
        }
    }

    // 2. Logic Khuyến mãi (Chỉ dùng các field thực tế trong Schema)
    if (this.queryString.isPromotion === 'true') {
        const now = new Date();
        finalQuery.isOnSale = true;
        finalQuery.discountStart = { $lte: now };
        finalQuery.discountEnd = { $gte: now };
    }

    this.query = this.query.find(finalQuery);
    return this;
}

  //3 Sap xep (Sort)
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Mac dinh moi nhat len dau
    }

    return this;
  }

  // 4 gioi han truong tra ve (Field Limiting)

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // mac dinh an truong noi bo
    }
    return this;
  }

  //Phan trang

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
