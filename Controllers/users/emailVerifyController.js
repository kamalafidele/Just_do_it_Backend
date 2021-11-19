const User=require("../../models/UserSchema");
const jwt=require("jsonwebtoken");

let maxAge=24*60*60*20
const createToken=(_id) =>{
       return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn:maxAge});
};

const handleEmailVerification=  (req, res, next) =>{
       
       let verificationCode=req.body.verificationCode;
   if(verificationCode==0 || verificationCode==""){
       return res.status(400).json({error:"Please enter the code "});
   }else{

       User.findOne({uniqueCode:req.body.verificationCode})
       .then((user) =>{
                if(!user){
                       return res.status(400).json({error:"Incorrect code. Please try again! "});
                } else {
                  if(user.status=="Active"){
                         return res.status(404).json({error:"Verified"});
                  }
                     user.status="Active";
                     user.save((err) =>{
                            if(err){
                                   console.log("SAVING ERROR ON EMAIL VERIFY",err);
                            }
   
                            const token=createToken(user._id);
                            return  res.status(200).json({token, user:{
                                     username:user.username,
                                     email:user.email,
                                     profile:user.avatar
                              }});
                     })
   
   
                }
   
       })
      .catch(err =>{
             console.log("EMAIL CONFIRMATION ERROR ",err);
            return res.status(500).json({error:"An error occurred "});
      })

   }
   

};

module.exports=handleEmailVerification;