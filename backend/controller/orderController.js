const Order = require('../database/model/orderModel');
const Product = require('../database/model/prodModel')
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

exports.newOrder = catchAsyncError( async(req,res,next) =>{
    console.log("wroking");
    const {shippingInfo,orderItems,paymentInfo,itemsInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        itemsInfo,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user : req.user._id,
    })
    res.status(200).json({
        success:true,
        order
    })
})
// user can see his/her all order
exports.getUserOrder = catchAsyncError( async(req,res,next) =>{
    const order = await Order.find({user:req.user._id});
    if(!order)
    {
        return next(new ErrorHandler("No order",400));
    }
    res.status(200).json({
        success:true,
        order
    })
})
// user can see his particular order 
exports.getSingleOrder = catchAsyncError( async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    if(!order)
    {
        return next(new ErrorHandler("Order has been cancelled",400));
    }
    res.status(200).json({
        success:true,
        order
    })
})

// get all order admin
exports.getAllOrder = catchAsyncError( async(req,res,next) =>{
    const order = await Order.find();
    let totalAmount=0;
    order.forEach(ord => totalAmount += ord.totalPrice);
    res.status(200).json({
        success:true,
        order,
        totalAmount
    })
})

// update order status admin
exports.upadteOrderStatus = catchAsyncError( async(req,res,next) =>{
    let order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new ErrorHandler("Order does not exist",400));
    }
    if(order.orderStatus == "Delivered")
    {
        return next(new ErrorHandler("Order Already delivered,You cannont change status",400));
    }
    order.orderItems.forEach(async (order) => {
        await updateStock(order.product,order.quantity)}
    )
    order.orderStatus = req.body.status;
    if(req.body.status == "Delivered")
    {
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true
    })    
});
async function updateStock(id,quantity)
{
    const prod = await Product.findById(id);
    prod.stock -=quantity;
    await prod.save({validateBeforeSave:false});
}

// delete order admin
exports.deleteOrder = catchAsyncError( async(req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new ErrorHandler("Order already Deleted",400));
    }
    await order.remove();
    res.status(200).json({
        success:true,
    })

})