const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user.js");
const authRoute = require("./routes/auth.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");
const orderRoute = require("./routes/order.js");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// dotenv provides us with a layer of security for public code, like our MongoDB key.
    dotenv.config();

//mongoose.connect is a promise, so we can either connect or fail. In case of connection we have a console log "DBConnection Successfull!" , if we fail we catch the error and log it.
    mongoose.connect(process.env.MONGO_URL
        ).then(()=> console.log("DBConnection Successfull!"))
        .catch((err) => {console.log(err);
        });

        //app.use(cors());
    //this app.use alows us to pass JSON files, for example when testing APIs with postman.
    app.use(express.json());

    //app.use with app.listen alows us to run our requests by passing them as localhost:5000/api/users/*ENDPOINT* (5000 is the port we are listening to, can be another)
    app.use("/api/auth", authRoute);
    app.use("/api/users", userRoute);
    app.use("/api/products", productRoute);
    app.use("/api/carts", cartRoute);
    app.use("/api/orders", orderRoute);
    app.use("/api/checkout", stripeRoute);


    app.listen(process.env.PORT || 5000, () => {
        console.log("Backend server is running!")
        });

