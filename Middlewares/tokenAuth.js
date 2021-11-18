const jwt=require("jsonwebtoken");
const User=require("../models/UserSchema");

const checker= async (req, res, next) =>{
    let token=req.headers.bearer;
    //console.log(token);
    if(token){
        jwt.verify(token,process.env.JWT_SECRET, async(err,decoded) =>{
            if(err){
                res.status(400).json({error:"Token expired "});
                res.locals.user=null;
                return
            }else{
                const user=await User.findById({_id:decoded._id});
                if(!user){
                      res.status(400).send({error:"Not authorized"});
                      res.locals.user=null;
                      return;
                }
                req.user=user;
                next();
            }
        })
    }else{
        res.status(400).json({error:"NO TOKEN SENT "});
        res.locals.user=null;
        return;
    }

}

module.exports=checker;
