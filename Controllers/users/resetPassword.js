const User=require("../../Models/UserSchema");
const transporter=require("../../Middlewares/emailTransporter");
const ResetSchema=require("../../Models/ResetPasswordSchema");
const {emailValidator}=require("../../Middlewares/errorValidator");

const resetPassword=async (req,res) =>{
let email=req.body.email;


const validateResult=emailValidator.validate({email});

if(validateResult.error){
return res.status(400).json({error:validateResult.error.details[0].message});
}else{

    email=email.toLowerCase();
    let userExist=await User.findOne({email:email}).exec();
    if(!userExist){
        return res.status(404).json({error:"Sorry that didn't work"});
    }

    let uniqueNumber=Math.floor(Math.random()*1022052)+"-"+Date.now();
    const reset=new ResetSchema({userId:userExist._id,uniqueNumber:uniqueNumber});
    
    await reset.save()
    .then(async ()=>{
     await   transporter.sendMail({
            from:"<mbonera31@gmail.com>",
            to:email,
            subject:"Reset your MBONERA Account password ",
            html:`
                <div>
                <img src="https://res.cloudinary.com/justdoit/image/upload/v1637511585/users/images/Just_logo_ubuaty.jpg" 
                style=" margin-left: auto; border-radius: 4px; border: 1px solid dodgerblue;" alt="shaka">
                <h1>MBONERA</h1>
                <h2>Hello ${userExist.firstname + " " + userExist.lastname}</h2>
                <p>You requested to reset your <strong>Mbonera</strong> password recently </p>
                <p>Click this link to reset your password </p>
                <p><a href="https://www.mbonera.live/shaka/reset/${reset.uniqueNumber}">Reset your password</a></p>
                <p style="padding: 10px; text-align: center; color: white; background: dodgerblue;">
                Copyright © 2021 - Mbonera. All Rights and Policies Reserved</p>
                </div>
             `
        }, (err,result) =>{
            if(err){
                ResetSchema.findOneAndDelete({_id:reset._id})
                .then(() =>{
                     return res.status(500).json({error:"An internal error occurred! Try again"});  
                })
                
            }else{
                return res.status(200).json({message:"Please check your email to reset  password"});
            }
            
        })
    })
    .catch(err =>{
        return res.status(500).json({error:"Internal server error "});
    })
    
}

};

const resendCode = async (req,res) =>{

 let email=req.body.email;
 email=email.toLowerCase();

 let uniqueNumber=Math.floor(Math.random()*1022052)+"-"+Date.now();
 let userExist= await  User.findOne({email:email,status:"Pending"}).exec();

 if(userExist){
     
     User.findOneAndUpdate({email:email,status:"Pending"},{$set:{uniqueCode:uniqueNumber}},{new:true})
     .then(() =>{
        
            transporter.sendMail({
                from:"<mbonera31@gmail.com>",
                to:email,
                subject:"Please confirm your account",
                html:`
                <div>
                <img src="https://res.cloudinary.com/find-yours/image/upload/v1634134419/Default-images/logo_u5tflg.png" 
                style="margin-left: auto; border-radius: 4px; border: 1px solid dodgerblue;" alt="shaka">
                <h1>Email confirmation to Mbonera account </h1>
                <h2>Hello ${userExist.firstname} ${userExist.lastname}</h2>
                <p>Thank you for registering with Mbonera. Please confirm your email </p>
                <p> <a href="https://mbonera.live/verifyAccount/${uniqueNumber}"> Verify your Account </a> </p>
                <p style="padding: 10px; text-align: center; color: white; background: dodgerblue;">
                Copyright © 2021 - Mbonera. All Rights and Policies Reserved</p>
                </div>
                 `
            }).then(() =>{
                return res.status(200).json({message:"Verify your account"});
            })
            .catch(err =>{
                return res.status(400).json({erorr:"Sending an email failed. Try again later!"});
            })
         
        
     })
     .catch(err =>{
         return res.status(400).json({error:"Error occurred. Try again later!"});
     })


 }else{
     return res.status(400).json({error:"Didn't sign up with Shaka or already active"});
 }
}

module.exports={resetPassword,resendCode};