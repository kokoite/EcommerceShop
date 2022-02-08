const Product = require('../database/model/prodModel')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const ApiFeature = require('../utils/apiFeature')
const category = ["footwear","electronics","mobile phones","furniture","clothing","laptop","grocery"];
exports.createProduct =  catchAsyncError(async (req,res,next) =>{
    req.body.user = req.user;
    const prod = await Product.create(req.body);
    res.status(200).json({success:true,prod})
})
exports.getProductBasedOnCategory = catchAsyncError(async(req,res,next)=>{
    const products = [];
    let idx=0;
    await Promise.all(category.map(async(item) =>{
        const list = await Product.find({category:item}).limit(5);
        if(list)
        {
            
            products[idx] = {item,list}
            idx++;
        }
    }))
    res.status(200).json({success:true,products});

})
exports.getAllProduct = catchAsyncError(async(req,res,next) =>{
    const resultPerPage = 9;
    const productCount = await Product.countDocuments();
    let apiFeature = new ApiFeature(Product.find(),req.query).search().filter();
    let products = await apiFeature.query;
    const filterResult = products.length;
    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();
    res.status(200).json({success:true,products,productCount,resultPerPage,filterResult})
})
exports.updateProduct = catchAsyncError(async (req,res,next) =>{
    let prod = await Product.findById(req.params.id);
    if(!prod)return next(new ErrorHandler("Not found",500))
    prod = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({success:true,prod});
})
exports.getProductDetail = catchAsyncError(async(req,res,next) =>{
    const prod = await Product.findById(req.params.id);
    if(!prod) return next(new ErrorHandler("Not found",500)) 
    res.status(200).json({success:true,prod});
})
exports.deleteProduct = catchAsyncError(async (req,res,next) =>{
    let prod = await Product.findById(req.params.id);
    if(!prod)return next(new ErrorHandler("Not found",500))
    await Product.deleteOne({_id:req.params.id});
    res.status(200).json({success:true,message:"deleted"});
})
exports.createReview = catchAsyncError(async(req,res,next) =>{
    const product = await Product.findById(req.params.id);
    if(!product) return next(new ErrorHandler("Prod not found",400));
    const {rating,comment} = req.body;
    const review = {
        name:req.user.name,
        rating:Number(rating),
        comment,
        user:req.user.id
    }
    let isReviewed = false,avgRating =0;
    product.reviews.forEach(rev => {
        if(rev.user.toString === req.user.toString)
        {
            isReviewed = true;
            rev.comment = comment;
            rev.rating = rating;
        }
        avgRating += rev.rating;
    });
    if(!isReviewed)
    {
        product.reviews.push(review);
        product.numOfReview = product.reviews.length;
    }
    avgRating/= product.numOfReview;
    product.rating = avgRating;
    await product.save({validateBeforeSave:false});
    res.status(200).json({success:true,message:"review added",review});
})
exports.getAllReview = catchAsyncError(async(req,res,next) =>{
    const product = await Product.findById(req.query.id);
    if(!product) return next(new ErrorHandler("Prod not found",401));
    res.status(200).json({success:true,reviews:product.reviews});
})
exports.deleteReview = catchAsyncError(async(req,res,next) =>{
    const product = await Product.findById(req.query.productId);
    if(!product) return next(new ErrorHandler("Prod not found",400));
    const reviews = product.reviews.forEach((rev) => rev.id.toString !== req.query.id);
    let rating=0,numOfReview=reviews.length;
    reviews.forEach((rev) => rating+= rev.rating);
    await Product.findByIdAndUpdate(req.query.productId,{reviews,rating,numOfReview},{
        new:true,
        useFindAndModify:false,
        runValidators:true,
    })
    res.status(200).json({success:true,message:"review deleted success"});
})