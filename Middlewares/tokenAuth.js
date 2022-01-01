const jwt=require("jsonwebtoken");
const User=require("../Models/UserSchema");

const checker= async (req, res, next) =>{
    let token=req.headers.bearer;

    if(token){
        jwt.verify(token,process.env.JWT_SECRET, async(err,decoded) =>{
            if(err){
                return res.status(400).json({error:"Token expired "});
            }else{
                const user=await User.findById({_id:decoded._id});
             if(!user){
                    return res.status(400).send({error:"Not authorized"});
                }
                req.user=user;
                next();
            }
        })
    }else{
        return  res.status(400).json({error:"NO TOKEN SENT "});
    }

}

module.exports=checker;
