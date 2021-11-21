const {OAuth2Client}=require("google-auth-library");
const key=require("../../Config/Keys");
const clientId=key.google4.clientID
const clientSecret=key.google4.clientSecret
const client=new OAuth2Client(clientId,clientSecret);
const jwt=require("jsonwebtoken");
const User=require("../../Models/UserSchema");


let maxAge=24*60*60*20
const createToken=(_id) =>{
       return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn:maxAge});
};
let uniqueNumber=Math.floor(Math.random()*1022052)+"-"+Date.now();

const googleLogin = async (req,res) =>{

     const token= req.body.token;
     //console.log(token);

if(token){
    const ticket=await client.verifyIdToken({
        idToken:token,
        audience:clientId
    });
 let user=ticket.getPayload();


  User.findOne({email:user.email})
 .then(currentUser =>{
     if(currentUser && currentUser.isGoogleUser==true){
        
         const token=createToken(currentUser._id);
         return res.status(200).json({token,user:{
             firstname:currentUser.firstname,
             lastname:currentUser.lastname,
             email:currentUser.email,
             profile:currentUser.avatar
         }});
     }else if(currentUser && !currentUser.isGoogleUser){
         
         return res.status(404).json({error:"You've signed up manually."});
     }
     else if(!currentUser){
         const newUser=new User({
             firstname:user.family_name,
             lastname:user.given_name,
             email:user.email,
             password:"Google",
             avatar:user.picture,
             status:"Active",
             uniqueCode:uniqueNumber,
             isGoogleUser:true
          });
        
          newUser.save()
          .then(() =>{
              const token=createToken(newUser._id);
              return res.status(200).json({token,user:{
                  firstname:newUser.firstname,
                  lastname:newUser.lastname,
                  email:newUser.email,
                  profile:newUser.avatar
              }});
          })
          .catch(err =>{
              console.log("CREATING GOOGLE USER EROR",err);
              return res.status(404).json({error:"Signing you in failed! Please try again"});
          })
     }
 });
  }else{
      return res.status(500).json({error:"An error occurred. Try again"});
  }
 

};



module.exports=googleLogin;
