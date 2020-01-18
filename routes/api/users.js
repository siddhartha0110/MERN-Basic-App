const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const User=require("../../models/User");
const config=require("config");
const JWT=require("jsonwebtoken");

// @route POST api/users
// @desc REGISTER users
// @access public
router.post("/",(req,res)=>{
    const {name,email,password}=req.body;

    // Check If All Fields Are Filled
    if(!name || !email || !password){
        return res.status(400).json({msg:"Please Enter All the fields"});
    }

    User.findOne({email})
    .then(user=>{
        if(user){
            return res.status(400).json({msg:"User Already Exists "})
        }

        const newUser=new User({
            name,
            email,
            password
        });

        bcrypt.genSalt(15,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password=hash;
                newUser.save()
                .then(user=>{
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
        })
    });
});

module.exports=router;