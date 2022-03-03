const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTRATION
router.post("/register", async (req,res) =>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //CryptoJS will encrypt our passwords with the advanced encryption standard.
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),

    });

    //saving a new user takes time, which is why we need to use the concept of async functions.
    try{
    const savedUser = await newUser.save();
    // 200 and 500 are status codes
    res.status(200).json(savedUser)
    } catch(err){
    res.status(500).json(err);
    }
});

//LOGIN

router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        // if there is no user with the provided name, const user will have a value of false, which allows the !user to be used to define alternative action.
        !user && res.status(401).json("Wrong Credentials!");
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
        const stringPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        stringPassword !== req.body.password && res.status(401).json("Wrong Credentials!");
            //JSON Web Token - JWT - is another layer of security for our application.
            const accessToken = jwt.sign({
                id:user._id, 
                isAdmin: user.isAdmin,
            },
            //we can use the JWT to keep our login active on the webpage - in this case, we will be required to login again after 7 days.
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
            );

        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    } catch(err) {
        res.status(500).json(err);
    }
});






module.exports = router;