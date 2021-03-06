const UserSchema = require("../../Models/UserSchema");
const jwt = require("jsonwebtoken");
const { loginValidator } = require("../../Middlewares/errorValidator");

let maxAge=24*60*60*20;
const createToken = _id =>  jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: maxAge });


const handleLogin = async function(req, res, next) {

    let { email, password } = req.body;

    let result = loginValidator.validate({email,password});

    if(result.error)
        return res.status(400).json({error:result.error.details[0].message});
    
    email = email.toLowerCase();
    let user = await UserSchema.findOne({ email: email }).exec();

    if(!user)
        return res.status(400).json({error:"Please try again or sign in with google"});
   
    if(user.status !== "Active")
        return res.status(400).json({ error: "Verify" });

    else if(user.isGoogleUser)
        return res.status(400).json({error:"Login with google instead"});
                             
    user.comparePassword( password , function(err,match){
        if(err || !match ) 
           return res.status(400).json({ error: " Invalid email or password"});
        
       const token = createToken(user._id);
       return  res.status(200).json({ token, user:{
                                   username: user.username,
                                   email: user.email,
                                   profile: user.avatar,
                                   isPro: user.isPro,
                                   darkMode: user.darkMode,
                                   session: user._id
                              }});
                  });
};

module.exports = handleLogin;
