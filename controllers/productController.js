const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandle.js");
const catchAsyncError = require("../middleware/AsyncRequiredError.js");
const ApiFeatures = require("../utils/apiFeatures.js");

// create Product
// exports.createProduct = async (req, res, next) => {
//   // .post me err nhi in params only check in under the function
//   // err,req,res,next
//   const product = await Product.create(req.body); // directly pass--
//   res.status(201).json({ success: true, product });
// };

// first time when required when true in msg
exports.createProduct = catchAsyncError(async (req, res, next) => {
  // .post me err nhi in params only check in under the function
  // err,req,res,next

  req.body.user = req.user.id;

  const product = await Product.create(req.body); // directly pass--
  res.status(201).json({ success: true, product });
});

exports.getAllproducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 5; // element there

  // --- not use
  const productCount = await Product.countDocuments();
  // -----

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // req.query.keyword

  // const allProducts = await Product.find();

  const allProducts = await apiFeature.query; // query bydefault is req.find();

  res.status(200).json({ message: "Route is working fine", allProducts });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    } //
  );
  res.status(200).json({
    success: true,
    // message: "update",
    // oldproduct: oldProduct,
    product,
  });

  // Extract keys from req.body
  //   try {
  //     const user = req.params.id;
  //     const updates = req.body;

  //     if (!user) {
  //       return res.status(404).send("User not found");
  //     }
  //     // Log the fields that are being updated
  //     for (let key in updates) {
  //       if (updates.hasOwnProperty(key)) {
  //         // hasOwnProperty --
  //         if (user[key] !== updates[key]) {
  //           console.log(
  //             `Field ${key} is being updated from ${user[key]} to ${updates[key]}`
  //           );
  //         }
  //       }
  //     }

  //     // Perform the update
  //     Object.assign(user, updates); // only use for copy one of object to another object  copy of user and update where necessary thing in there
  //     await user.save();
  //   } catch (e) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to update product",
  //     });
  //   }
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await product.deleteOne();

  //   one way to delete
  //   await product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: `date with id : ${product}`,
    // oldproduct: oldProduct,
  });
});

exports.getProductDetailsOne = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  //   one way to delete
  //   await product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    product,
    // oldproduct: oldProduct,
  });
});

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  )

  if (isReviewed) {
    {
      product.reviews.forEach(rev => {
        if(rev.user.toString()=== req.user._id.toString())
        (rev.rating = rating),
        (rev.comment = comment)
      })
    }     
  } else {
    product.reviews.push(review);
  }

  // 

  let avg  = 0;
  product.ratings = product.reviews.forEach(rev => {
    avg += rev.rating
  }) / product.reviews.length;
  await product.save({ validateBeforesave : false }); // it //
  res.status(200).json({
    success: true
  })
});

// fet all reviews of products

exports.getProductReviews = catchAsyncError(async(req,res,next)=>{
  const product = await product.findById(req.query.id);
  if(!product){
      return next(new Error("can not get Product reviews",400))
  }
  res.status(200).json({
    success:true,
    reviews : product.review,
  })
})

//Delete reviews
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
  const product = await product.findById(req.query.productId);
  
  if(!product){
    return next(new Error("can not get Product reviews",400))
}
const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

let avg = 0;

reviews.forEach((rev)=>{
  avg += rev.rating;
})

const rating = reviews.length===0 ? 0 : avg/reviews.length;
const numOfReviews = reviews.length;

await product.findByIdAndUpdate(req.query.productId,{
  reviews,
  rating,
  numOfReviews      
},{
  new : true,
  runValidators : true,
  useFindAndModify : false
})


res.status(200).json({
  success:true,
  reviews//
})
}
)
