const mongoose = require('mongoose');
const connectDatabase = () =>{
    mongoose.connect(process.env.DB_URI,()=>{
        console.log("mongoDb success")
    })
}
module.exports = connectDatabase;