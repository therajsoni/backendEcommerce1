class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // keyword -- product
    const keyword = this.queryStr.keyword
      ? {
          name: {
            // it only for name
            $regex: this.queryStr.keyword,
            $options: "i", // special case here it is
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // case sencitive it is means filter karne ke liye option dege
  // category -- Laptop
  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing some Fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((removeField) => delete queryCopy[removeField]);

    // Range for process
    // -----------------------------------------------------------------------
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr)); //
    // ------------------------------------------------------------------------
    // this.query = this.query.find(queryCopy); // not {queryCopy}  because it defult object
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1; //Number because it is a String
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.skip(skip).limit(resultPerPage);
    return this; // this as all return
  }
}

module.exports = ApiFeatures;
