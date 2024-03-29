const UserSchema = require("../../Models/UserSchema");
const transporter = require("../../Middlewares/emailTransporter");
const { signupValidator } = require("../../Middlewares/errorValidator");




const handleRegister = async function(req, res, next) {
    let { username, email,password, confirmPassword } = req.body;
    email = email.toLowerCase();
    
    const result = signupValidator.validate({ username, email, password, confirmPassword });   

    if(email.includes("testing") || email.includes("user")){
       return  res.status(400).json({ error: "Use a valid email please" });
    }
     
    if(result.error ) 
      return  res.status(400).json({error:result.error.details[0].message});
 
    if(confirmPassword !== password) 
      return  res.status(400).json({error:"Passwords don't match"});
        
    let userExist = await UserSchema.findOne({email:email}).exec();
    if(userExist) 
       return  res.status(400).json({ error: "User with that email already exists" });


    let uniqueNumber = Math.floor(Math.random()*1022052) + "-" + Date.now();

    const user = new  UserSchema({
       username,
       email,
       password,
       avatar: "https://res.cloudinary.com/find-yours/image/upload/v1633708950/users/images/Person1_t6fjtq.png",
       status: "Pending", uniqueCode: uniqueNumber, isGoogleUser: false
       });
 
    try {
       await user.save();
       await transporter.sendMail({
              from:`<${process.env.SMTP_EMAIL}>`,
              to: email,
              subject: "Please confirm your account ",
              html:`
              <div>
              <img src="https://res.cloudinary.com/justdoit/image/upload/v1642443198/questionImages/images/Logo1_abbjeu.png" alt="im" style="width: 150px; height: 100px; border-radius: 5px;">
             <h1 style="text-align: left; padding-left: 5px">JustDoIt</h1>
              <h1>Email confirmation to JustDoIt account </h1>
              <h2>Hello ${username} </h2>
              <p>Thank you for registering with JustDoIt. Please confirm your email </p>
              <p> <a href="https://justdoit-rw.netlify.app/verifyEmail/${uniqueNumber}" style="text-decoration: none; border-radius: 4px; background-color: dodgerblue; color: white; padding: 10px;"> Verify your Account </a> </p>
              <p style="padding: 10px; text-align: center; color: white; background: dodgerblue;margin-top:10px;">
              Copyright © 2021 - JustDoIt. All Rights and Policies Reserved</p>
              </div>
              `
       });
       return  res.status(200).json({ message: "User registered successfully! Please check your email" });

    } catch( e ) {
       await UserSchema.findOneAndDelete({ email: email });    
       return   res.status(500).json({error:"Signing up failed! Try again later"});
    }  
    
 };

 module.exports = handleRegister;