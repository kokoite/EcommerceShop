const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middleware/error')
const dotenv = require('dotenv');
dotenv.config({path:"backend/config/config.env"});
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use(cookieParser());
const prod = require('./router/prodRoute');
const user = require('./router/userRoute')
const payment = require('./router/paymentRoute')
const order = require('./router/orderRoute');
app.use("/api/v1",prod);
app.use("/api/v1",user);
app.use("/api/v1",payment);
app.use("/api/v1",order);
app.use(errorMiddleware);
module.exports = app;