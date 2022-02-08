const mongoose = require('mongoose')
const prod = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter price"]
    },
    description:{
        type:String,
        required:[true,"Enter description"]
    },
    price:{
        type:Number,
        required:[true,"Enter price"],
        maxlength:[8,"Price cannot exceed  8 figure"]
    },
    category:{
        type:String,
        required:[true,"Enter category"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:[true,"Enter public_id"]
            },
            url:{
                type:String,
                required:[true,"Enter url"]
            }
        },
    ],
    stock:{
        type:Number,
        default:1,
        required:true,
        maxlength:[4,"Enter less than 4 figure"]
    },
    numOfReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = new mongoose.model('Product',prod);