const WorkspaceSchema = require("../../Models/Workspace");
const { workspaceValidator } = require("../../Middlewares/errorValidator");
const UserWorkspaceSchema = require("../../Models/UserWorkspace");

const addWorkspace = async (req,res) => {
 const { name, description, picture } = req.body;


  if(name == "" && description == "" && picture == "")
     return res.status(400).json({error:"Please provide all details for workspace"});
  
   const validationResult = workspaceValidator.validate({name,description,picture});

   if(validationResult.error){
       return res.status(400).json({error:validationResult.error.details[0].message});
   }else{
    try{
        let workspaceExist = await WorkspaceSchema.findOne({name:name})
        if(workspaceExist)
            return res.status(400).json({error:`Workspace ${name} exists`});
        
        let workspace = await new WorkspaceSchema({name:name,description:description,picture:picture,creator:req.user._id});
        workspace.save()
         .then(() => res.status(200).json({message: "Workspace created successfully "}))
         .catch(err => res.status(500).json({error: "Unexpected error occurred! Try again"}) );
           
      }catch(err){
          return res.status(400).json({error:"Unexpected error occurred! Try again"});
      }
   }  

}

const getWorkspaces = (req,res) => {
  WorkspaceSchema.find()
  .then(workspaces => res.status(200).json({workspaces}) );
}

const addUserWorkspaces = async (req,res) =>{
    let workspaces = req.body;

   if(workspaces.length !== 5){
       return res.status(400).json({error:"Please provide enough workspaces"});
   }else{
       let userWorkspace = new UserWorkspaceSchema({user:req.user._id,workspaces: [workspaces[0]._id, workspaces[1]._id,
                                                    workspaces[2]._id, workspaces[3]._id, workspaces[4]._id]
                                                  });
       
      userWorkspace.save()
      .then(() => res.status(200).json({message:"Your workspaces has been added successfully"}))
      .catch(err => res.status(400).json({error:"An internal server error occurred! Try again"}));  
   }

}

const getUserWorkspaces = async (req,res) => {
 try{
   let userWorkspaces = await  UserWorkspaceSchema.find({user:req.user._id})
                                                  .populate({path:"workspaces",select:"name description picture"});
   return res.status(200).json({userWorkspaces:userWorkspaces});
    
  }catch(err){
      return res.status(500).json({error:"An internal server error occurred! Try again"})
    }
 

}

module.exports = { addWorkspace, getWorkspaces, addUserWorkspaces, getUserWorkspaces };