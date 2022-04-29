const QuestionSchema = require("../../Models/QuestionSchema");
const AnswerSchema = require("../../Models/AnswerSchema");

const addQuestion = async (req,res) =>{
  let { topic , question } = req.body;
  let user = req.user;

  if(question.toUpperCase().includes("HUTU") || question.toUpperCase().includes("TUTSI"))
    return res.status(400).json({ error: "An invalid question" });

  try {
     const createdQuestion = new QuestionSchema({question:question,topic:topic,askedBy:user._id});
     await  createdQuestion.save();
     let questionToSend = await QuestionSchema.findById({_id: createdQuestion._id}).populate([{path:"askedBy"},{path:"topic"}]);

     return res.status(200).json({ message: "Question added successfully.", addedQuestion: questionToSend });
  }catch(err) { 
    return res.status(500).json({ message: "Internal server error occured! Try again "})
  }
}

const getAllQuestions= async (req,res) =>{
   
  try{
    let questions = await QuestionSchema.find().sort({createdAt:"desc"}).populate([{path:"topic",select:"name picture"},
    {path:"askedBy"},{path:"answertoshow",populate:[{path:"comments"}]}]);

    return res.status(200).json({questions});

  }catch(err){
    return res.status(500).json({error:"Internal server error occured! Try again "})
  }

}

const getTopicQuestions = async (req,res) => {
     let workspaceId = req.params.workspaceId;
    try{
      let topicQuestions = await QuestionSchema.find({topic:workspaceId}).sort({createdAt:"desc"}).populate([{path:"topic",select:"name picture"},
      {path:"askedBy",select:"username avatar isPro"},{path:"answertoshow",populate:[{path:"comments"}]}]);
  
      return res.status(200).json({ topicQuestions });
    } catch(err){
      return res.status(500).json({ error: "Internal server error occured! Try again " });
    }

}

const getQuestionAndAnswers = async (req,res) =>{
  try{

    let questionId = req.params.questionId;
    let question = await QuestionSchema.findById({_id:questionId}).populate([{path:"askedBy",select:"username avatar isPro"},{path:"topic"}]);
    let answers = await AnswerSchema.find({ question: questionId });
    
    return res.status(200).json({ question: question, answers: answers });

  }catch(err){
    return res.status(500).json({error:"Internal server error occured! Try again "})
  }
}

module.exports={ addQuestion, getTopicQuestions, getAllQuestions, getQuestionAndAnswers};