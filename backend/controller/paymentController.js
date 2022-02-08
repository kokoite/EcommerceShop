const catchAsyncError = require('../middleware/catchAsyncError')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
exports.paymentProcess = catchAsyncError(async(req,res,next)=>{
    console.log("finally got here");
    const myPayment = await stripe.paymentIntents.create({
      amount:req.body.amount,
      currency:"inr",
      metadata:{
          company:"Ecommerce"
      },
  })  
  res.status(200).json({success:true,client_secret:myPayment.client_secret});
})
exports.sendStripeApiKey = catchAsyncError(async(req,res,next) =>{
    res.status(200).json({
        success:true,key:process.env.STRIPE_API_KEY,
    })
})