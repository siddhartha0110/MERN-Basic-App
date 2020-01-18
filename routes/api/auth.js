const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const User=require("../../models/User");
const config=require("config");
const JWT=require("jsonwebtoken");
const auth=require("../../middleware/auth");

// @route POST api/auth
// @desc AUTH user
// @access public
router.post("/",(req,res)=>{
    const {email,password}=req.body;

    // Check If All Fields Are Filled
    if(!email || !password){
        return res.status(400).json({msg:"Please Enter All the fields"});
    }

    User.findOne({email})
    .then(user=>{

        if(!user){
            return res.status(400).json({msg:"User Does Not Exist"});
        }
        //Check Password
        bcrypt.compare(password,user.password)
        .then(isMatch=>{
            if(!isMatch){
                return res.status(400).json({msg:"Invalid Creds."});
            }
            JWT.sign(
                {
                    id:user.id
                },
                config.get("jwtSecret"),
                { expiresIn:3600 },
                (err,token)=>{
                    if(err) throw err;

                    res.json({
                        token,
                        user:{
                            id:user.id,
                            name:user.name,
                            email:user.email
                        }
                    })
                }
            )
        })
        
    })
    .catch(err=>{
        return res.status(400).json({msg:"Internal Error"});
    })
});

// @route GET api/auth/user
// @desc GET user data
// @access PRIVATE
router.get("/user",auth,(req,res)=>{
    User.findById(req.user.id)
    .select("-password")
    .then(user=>res.json(user));
})


module.exports=router;