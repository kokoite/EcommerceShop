const app = require('./app')
const connectDatabase = require('./database/connect');
const clodinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config({path:"backend/config/config.env"});
process.on('uncaughtException',(err)=>{
    console.log(err.message);
    console.log("Server shutting down");
    process.exit(1);
})
connectDatabase();
clodinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started`);
})
process.on('unhandledRejection',(err) =>{
    console.log(err.message);
    console.log("Shutting down server");
    server.close(()=>{
        process.exit(1);
    });
})