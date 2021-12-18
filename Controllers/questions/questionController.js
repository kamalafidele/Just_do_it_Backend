const QuestionSchema=require("../../Models/QuestionSchema");
const cloudinary=require("cloudinary");
const AnswerSchema=require("../../Models/AnswerSchema");

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
   
  try{
    let questions= await QuestionSchema.find().populate([{path:"topic",select:"name picture"},
    {path:"askedBy",select:"username avatar isPro"},{path:"answertoshow"}]);

    for(let i=0; i<questions.length; i++){
      questions.sort((a,b) => {return b.createdAt - a.createdAt});
    }

    return res.status(200).json({questions});

  }catch(err){
    return res.status(500).json({error:"Internal server error occured! Try again "})
  }

}

const getTopicQuestions=async (req,res) =>{
     let workspaceId=req.params.workspaceId;
    try{
      let topicQuestions= await QuestionSchema.find({topic:workspaceId}).populate([{path:"topic",select:"name picture"},
      {path:"askedBy",select:"username avatar isPro"},{path:"answertoshow"}]);
  
      for(let i=0; i<topicQuestions.length; i++){
        topicQuestions.sort((a,b) => {return a.createdAt - b.createdAt});
      }
       
      return res.status(200).json({topicQuestions});
    } catch(err){
      return res.status(500).json({error:"Internal server error occured! Try again "})
    }

}

const getQuestionAndAnswers= async (req,res) =>{
  try{

    let questionId=req.params.questionId;
    let question=await QuestionSchema.findById({_id:questionId}).populate([{path:"askedBy",select:"username avatar isPro"}]);
    let answers=await AnswerSchema.find({question:questionId});
    
    return res.status(200).json({question:question,answers:answers});

  }catch(err){
    return res.status(500).json({error:"Internal server error occured! Try again "})
  }
}

module.exports={addQuestion,getTopicQuestions,getAllQuestions,getQuestionAndAnswers};