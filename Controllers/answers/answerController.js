const AnswerSchema=require("../../Models/AnswerSchema");
const cloudinary=require("cloudinary");
const QuestionSchema=require("../../Models/QuestionSchema");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

async function upload(imagesNum,imagedata){
    let imagesUrl=[];
    let img;
    for(let i=0; i<imagesNum; i++){
        img = await cloudinary.v2.uploader.upload(imagedata[i],{folder: 'answerImages/images',
            allowed_formats:['png','jpg','webp','svg','jfif','gif']});
            imagesUrl.push(img.url);
     }
 
     return imagesUrl;
}

const addAnswer= async (req,res) =>{
    let {answer,question,images}=req.body;
    let user=req.user;
    let imagesNumber=images.length;
     
    try{

      if(imagesNumber == 0){
        const createdAnswer=new AnswerSchema({answer:answer,question:question,answeredBy:user._id})
        
        await createdAnswer.save();
        await QuestionSchema.findOneAndUpdate({_id:question},{answertoshow:createdAnswer._id})
      }
      else if(imagesNumber >0){
        urls= await upload(imagesNumber,images);

        const createdAnswer=new AnswerSchema({answer:answer,question:question,answeredBy:user._id,
           images: imagesNumber == 2 ? [ urls[0],urls[1] ]:[ urls[0] ] });
         
           await createdAnswer.save();
           await QuestionSchema.findOneAndUpdate({_id:question},{answertoshow:createdAnswer._id});
   }

   let questionsToSend=await QuestionSchema.find().sort({createdAt:"desc"}).populate([{path:"topic",select:"name picture"},
   {path:"askedBy"},{path:"answertoshow",populate:[{path:"comments"}]}]);
   
   return res.status(200).json({message:"Answer added successfully.",newAllQuestions:questionsToSend});

    }catch(err){
      return res.status(500).json({message:"Internal error occured! Try again "})
    }

}

const getAllAnswers= async (req,res) =>{
 try{
  let answers= await AnswerSchema.find().populate([{path:"question",select:"name"},
  {path:"answeredBy",select:"username avatar"}]).populate([{path:"comments"}]);
  return res.status(200).json({answers});

 }catch(err){
  return res.status(500).json({error:"Internal error occured! Try again"})
 }
}

const getQuestionAnswers=async (req,res) =>{
     let questionId=req.params.questionId;
     
     try{
      let questionAnswers= await AnswerSchema.find({question:questionId}).populate([{path:"answeredBy",select:"username avatar isPro"},
     {path:"comments"}]);
      
      return res.status(200).json({questionAnswers});
     }catch(err){
      return res.status(500).json({error:"Internal error occured! Try again"})
     }
}

const upVote = async (req,res) =>{
    let {answerId,isReduce}=req.body;
    
   try{
    let answerToUpvote=await AnswerSchema.findOne({_id:answerId});
    let newVote=answerToUpvote.upVotes;
    await AnswerSchema.findOneAndUpdate({_id:answerId},{upVotes: isReduce ? newVote-1 : newVote+1});

    return res.status(200).json({message:"Voted successfully"});
   }catch(err){
    return res.status(500).json({error:"Internal error occured! Try again"})
   }
}

const downVote = async (req,res) =>{
  let {answerId,isReduce}=req.body;
  try{
    let answerTodownvote=await AnswerSchema.findOne({_id:answerId});
    let newVote=answerTodownvote.downVotes;
   await  AnswerSchema.findOneAndUpdate({_id:answerId},{downVotes:isReduce ? newVote-1 : newVote+1})

   return res.status(200).json({message:"Down voted successfully"});
  }catch(err){
    return res.status(500).json({error:"Internal error occured! Try again"})
  }
}

module.exports={addAnswer,getQuestionAnswers,upVote,downVote,getAllAnswers};