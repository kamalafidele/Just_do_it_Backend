const UserSchema=require("../../models/UserSchema");
const gravatar=require("gravatar");
const transporter=require("../../middlewares/emailTransporter");
const {signupValidator} =require("../../middlewares/errorValidator");




const handleRegister= async function(req,res,next) {
    let {username, email,password, confirmPassword}=req.body;
    email=email.toLowerCase();
    
    const result= signupValidator.validate({username,email,password,confirmPassword});
    if(email=="" && password=="" && username=="" && confirmPassword==""){
       return res.status(400).json({error:"Please fill all required fields"});    
}
     
    if(result.error) {
            return  res.status(400).json({error:result.error.details[0].message});
    } else {
 
        if(confirmPassword!==password) {
             return  res.status(400).json({error:"Passwords don't match"})
        }
        let userExist= await UserSchema.findOne({email:email}).exec();
        if(userExist) {
             return  res.status(400).json({error:"User with that email already exists"});
        }else{
       //  const avatar=gravatar.url(email,{
       //         s:400,
       //         r:"pg",
       //         d:"mm"
       //  });

        let uniqueNumber=Math.floor(Math.random()*1022052)+"-"+Date.now();

        const user= await new  UserSchema({username,email,password,
            avatar:"https://res.cloudinary.com/find-yours/image/upload/v1633708950/users/images/Person1_t6fjtq.png",
            status:"Pending",uniqueCode:uniqueNumber,isGoogleUser:false});
 

      await user.save()
        .then( () => {
               
               transporter.sendMail({
                      from:`<justdoitrw2@gmail.com>`,
                      to:email,
                      subject:"Please confirm your account ",
                      html:`
                      <div>
                      <img src="https://res.cloudinary.com/justdoit/image/upload/v1637511585/users/images/Just_logo_ubuaty.jpg" 
                      style="margin: 10px auto; border-radius: 4px; border: 1px solid dodgerblue;" alt="JustDoIt">
                      <h1>JustDoIt</h1>
                      <h1>Email confirmation to JustDoIt account </h1>
                      <h2>Hello ${username} </h2>
                      <p>Thank you for registering with JustDoIt. Please confirm your email </p>
                      <p> <a href="http://localhost:4200/verifyEmail/${uniqueNumber}"> Verify your Account </a> </p>
                      <p style="padding: 10px; text-align: center; color: white; background: dodgerblue;">
                      Copyright © 2021 - JustDoIt. All Rights and Policies Reserved</p>
                      </div>
                      `
               }, (err) => {
                      if(err) { 
                             console.log(err);
                            UserSchema.findOneAndDelete({email:email})
                            .then(() =>{
                                   return res.status(500).json({error:"Something wrong! Try again"});
                            })
                             
                            }
                      else {
                           return  res.status(200).json({message:"User registered successfully! Please check your email "});
                      }
               })
             
               
               
        })
       .catch(err => {
              console.log(err);
           return   res.status(500).json({error:"Signing up failed! Try again later"});
       })
        }
 
    }
 };

 module.exports=handleRegister;