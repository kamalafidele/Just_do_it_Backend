const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const UserWorkspaceSchema = require("../Models/UserWorkspace");

const checker = async (req, res, next) =>{
    let token = req.headers.bearer;

    if(token) {
      try {

      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const user = await User.findById({_id: decoded._id});
      if(!user)
       return res.status(400).send({error:"Not authorized"});

       if(req.url.includes("allQuestions")){
        const userWorkspaces = await UserWorkspaceSchema.find({ user: user._id }); 
        req.userWorkspaces = userWorkspaces[0].workspaces;
       }
      
       req.user = user; 
       next();

      }catch(e){
        return  res.status(500).json({error:"Unexpected error occurred!"});
      }
    }else{
        return  res.status(400).json({error:"NO TOKEN SENT "});
    }

}

module.exports = checker;
