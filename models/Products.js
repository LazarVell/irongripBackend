const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        title:{type: String , required:true},
        description:{type:String, required:true},
        img: {type:String, required:true},
        categories: {type: Array},
        size: {type:Array},
        types: {type:Array},
        price: {type:Number, required:true},
        inStock: {type:Boolean, default: true},


    },
    // Instead of adding a date parameter, we can just use the Mongoose built in timestamps.
    {timestamps: true}
);


module.exports = mongoose.model("Product", ProductSchema);