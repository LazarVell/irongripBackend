const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAuthenticate, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", async (req,res) =>{
    const newCart = new Cart(req.body)

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err)
    }
});



//UPDATE
router.put("/:id", verifyTokenAuthenticate, async (req,res) =>{

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedCart);
    }catch(err)
    {res.status(500).json(err);
    };
});

//DELETE

router.delete("/:id", verifyTokenAuthenticate, async (req,res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted.");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER CART

router.get("/find/:userId", verifyTokenAuthenticate, async (req,res) => {
    try{
        //findById can't be used here because it will bind to the cart ID, while our condition is user ID. We write our own condition.
        //every user can have only 1 cart, so use findOne.
        const Cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json({Cart});
    }catch(err){
        res.status(500).json(err);
    }
});

//GET ALL

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    };
});

module.exports = router;