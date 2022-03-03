const User = require("../models/User");
const { verifyToken, verifyTokenAuthenticate, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAuthenticate, async (req,res) =>{
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){res.status(500).json(err);
    }
});

//DELETE

router.delete("/:id", verifyTokenAuthenticate, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER

router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try{
        const user = await User.findById(req.params.id);
        // separate password from all other information, then feed everything but password as response. 
        const {password, ...others} = user._doc;
        res.status(200).json({others});
    }catch(err){
        res.status(500).json(err);
    }
});

//GET ALL USERS

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new
    try{
        //Working with passing queries directly in the URL - passing ?new = true in this case will return the newest 5 users.
        const users = query 
        ? await User.find().sort({_id: -1}).limit(5) 
        : await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET USER STATS
// In this case, we are getting the month in which the account was created.

router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte:lastYear} } },
            {
                $project:{month: {$month: "$createdAt"},},
            },
            {
                $group: { _id: "$month", total: {$sum: 1}, }
            }
        ]);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

// TESTS

/*
router.get("/usertest", (req,res) => {
    res.send("user test is successfull");
});


router.post("/usersposttest", (req,res) => {
    const username = req.body.username
    res.send("your username is:" + username)
});
*/


module.exports = router;