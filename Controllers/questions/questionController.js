const QuestionSchema=require("../../Models/QuestionSchema");
const cloudinary=require("cloudinary");

cloudinary.config({ 
    cloud_name: 'justdoit', 
    api_key: '959232878426886', 
    api_secret: 'HdJRQW9QHzNrM7R9LX5dFELCBig' 
  });


const addQuestion= async (req,res) =>{
  let {topic,question}=req.body;
  let user=req.user;

  const createdQuestion=new QuestionSchema({question:question,topic:topic,askedBy:user._id})
  createdQuestion.save()
  .then(() => { return res.status(200).json({message:"Question added successfully."})})
  .catch(err => {console.log("Adding question ERR: ",err); return res.status(500).json({message:"Internal server error occured! Try again "})});

}

const getAllQuestions= async (req,res) =>{

  let questions= await QuestionSchema.find().populate([{path:"topic",select:"name picture"},
  {path:"askedBy",select:"username avatar isPro"},{path:"answertoshow"}]);

  return res.status(200).json({questions});
}

const getTopicQuestions=async (req,res) =>{
     let workspaceId=req.params.workspaceId;
     
    let topicQuestions= await QuestionSchema.find({topic:workspaceId}).populate([{path:"topic",select:"name picture"},
    {path:"askedBy",select:"username avatar isPro"},{path:"answertoshow"}]);

    return res.status(200).json({topicQuestions});
}



module.exports={addQuestion,getTopicQuestions,getAllQuestions};