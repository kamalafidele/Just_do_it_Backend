const User=require("../../models/UserSchema");
const ResetSchema=require("../../models/ResetPasswordSchema");
const bcrypt=require("bcrypt");
const {resetValidator}=require("../../middlewares/errorValidator");


const confirmPasswordReset= async (req,res) =>{

   const {newPassword,retype,uniqueNumber}=req.body;
   if(newPassword == "" && retype == "" && uniqueNumber==""){
      return res.status(404).json({error:"Please fill  the required fields"});
   }

  const checkError=resetValidator.validate(req.body);
   if(checkError.error){
      return res.status(400).json({error:checkError.error.details[0].message});
   }

   if(newPassword != retype){
      console.log("Passwords don't match");
      return res.status(400).json({error:"Passwords don't match"})
   }
 
   let askedReset=await ResetSchema.findOne({uniqueNumber:uniqueNumber}).exec();

   if(askedReset){

      await bcrypt.genSalt(8)
      .then(salt =>{
         bcrypt.hash(newPassword,salt, function(err,hash){
            if(err){
               return res.status(500).json({error:"Resetting password failed! Try again later"});
            }
            User.findOneAndUpdate({_id:askedReset.userId},{$set:{password:hash}},{new:true},(err,doc) =>{
               if(doc){
                  return res.status(200).json({message:"Password updated successfully "});
               }
            })
  
         })
      })
      .catch(error =>{
         return res.status(500).json({error:"Resetting password failed! Try again later"});
      })

   } else {
      return res.status(404).json({error:"You didn't ask to reset password "});
   }

}

module.exports=confirmPasswordReset;