const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({


    name: {
        type: String,
       
    },

    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,

    },

    price: {
        type: Number,
        required: true,
        min: [1, "Price cannot be in negative number or 0"]
    },

    rating: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String
    }



});

const ProductModel=mongoose.model('Product',ProductSchema);
module.exports=ProductModel;