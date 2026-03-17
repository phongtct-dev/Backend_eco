class APIFeatures {
  constructor(query, queryString) {
    this.query = query; /// Mogo query
    this.queryString = queryString; //req.query
  }

  //1 Tim kiem theo ten (Search)
  search() {
    if (this.queryString.keyword) {
      // Sử dụng $text search của MongoDB
      this.query = this.query
        .find(
          { $text: { $search: this.queryString.keyword } },
          { score: { $meta: "textScore" } },
        )
        .sort({ score: { $meta: "textScore" } });
    }
    return this;
  }

  //2 Bo loc nang cao

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "name","role"];
    excludedFields.forEach((el) => delete queryObj[el]); //để xóa key đó khỏi queryObj

    //
    // 1. Xử lý lọc Khuyến mãi đang hoạt động
    if (this.queryString.isPromotion === 'true') {
        const now = new Date();
        this.query = this.query.find({
            isOnSale: true,
            discountStart: { $lte: now },
            discountEnd: { $gte: now }
        });
    }

    // chuyen query sang Mogo
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);


    //
    this.query = this.query.find(JSON.parse(queryStr));
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
