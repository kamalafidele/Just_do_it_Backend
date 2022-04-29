const User = require("../../Models/UserSchema");
const ResetSchema = require("../../Models/ResetPasswordSchema");
const bcrypt = require("bcrypt");
const { resetValidator } = require("../../Middlewares/errorValidator");


const confirmPasswordReset= async (req,res) => {

   const { newPassword, retype, uniqueNumber } = req.body;

  const checkError = resetValidator.validate(req.body);
  if(checkError.error)
     return res.status(400).json({error:checkError.error.details[0].message});
   
   if(newPassword != retype)
      return res.status(400).json({error:"Passwords don't match"})

   let askedReset = await ResetSchema.findOne({ uniqueNumber: uniqueNumber }).exec();

   if(!askedReset)
     return res.status(404).json({error:"You didn't ask to reset password "});

     try { 
       const salt = await bcrypt.genSalt(8);
       const hash = await bcrypt.hash(newPassword,salt);
       await User.findOneAndUpdate({_id: askedReset.userId },{ $set: { password: hash } },{ new: true });

       return res.status(200).json({message: "Password updated successfully "});

      } catch( e ) {
       return res.status(500).json({error: "Resetting password failed! Try again later"});
      }

}

module.exports=confirmPasswordReset;