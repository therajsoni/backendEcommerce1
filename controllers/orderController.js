const Order = require("../models/orderModel");
const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandle.js");
const catchAsyncError = require("../middleware/AsyncRequiredError.js");

// Create new Order
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItem,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItem,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id,
    });
    res.status(201).json({
        success : true,
        order
    })
})

// get Single Order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user"
        ,"name email"); //also give subSchema details give by populate
    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }
    res.status(200).json({
        success : true,
        order
    })
})

// get logged in user Orders
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.params._id});
               
    res.status(200).json({
        success : true,
        orders,
    })
})

// get all Orders --Admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();
    
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })


    res.status(200).json({
        success : true,
        totalAmount,
        orders,
    })
});

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
    if(!order){
        return next(new ErrorHandler("order not found with this id"));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400))
    }

    order.orderItems.forEach(async(order) => { // updateStock function call
       await updateStock(order.product,order.quantity);//await
    })

    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = date.now()
    }
    await order.save({validateBeforeSave : false});

    res.status(200).json({
        success : true,
    })

});

async function updateStock(id,quantity){
const product = await Product.findById(id);
product.Stock -= quantity;
await product.save({validateBeforeSave : false});
}


// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
   
    const order = await Order.findById(req.params.id);
   
    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }
   
    await Order.deleteOne({ _id: req.params.id });

   
    res.status(200).json({
        success : true,
        message: "Order deleted successfully",
    })
});
