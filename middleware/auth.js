const config=require("config");
const JWT=require("jsonwebtoken");

function auth(req,res,next){
    const token=req.header('x-auth-token');

    //Check For Token
    if(!token) res.status(401).json({msg:"No Token, Authorization Denied"});

    try{
        //Verify Token
        const decoded=JWT.verify(token,config.get("jwtSecret"));
        req.user=decoded;
    
        next();
    }
    catch(e){
        res.status(400).json({msg:"Token Invalid"});
    }
}
module.exports=auth;