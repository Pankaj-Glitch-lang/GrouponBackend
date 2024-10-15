const express=require('express');
const mongoose=require('mongoose');
const ProductRouter = require('./router/product.route');
const cors=require('cors');
const UserRouter = require('./router/user.route');
const dotenv = require('dotenv');
dotenv.config();
const router = require('./router/cart.routes');
const uri =process.env.mongodb_uri;
const PORT=process.env.PORT
console.log(uri,PORT)
const app=express();
app.use(express.json())
app.use(cors())



const atlasDb= ()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));

}

app.use('/product',ProductRouter);
app.use('/auth',UserRouter);
app.use('/cart',router)

app.listen(PORT,(err)=>{
    if(!err){
        console.log('Server Started..');
        atlasDb()
    }else{
        console.log('Something Went wrong',err);
    }
})