const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userID:{type: String , required:true},
        //products contain multiple specific parameters, so they are defined as array and have objects within, rather than an object with an array of data.
        products:[
            {
                productID:{
                    type:String,
                },
                quantity:{
                    type:Number,
                    default: 1,
                },
            },
        ],
    },
    {timestamps: true}
);


module.exports = mongoose.model("Cart", CartSchema);