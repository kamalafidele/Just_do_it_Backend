const AnswerSchema=require("../../Models/AnswerSchema");
const cloudinary=require("cloudinary");
const QuestionSchema=require("../../Models/QuestionSchema");

cloudinary.config({ 
    cloud_name: 'justdoit', 
    api_key: '959232878426886', 
    api_secret: 'HdJRQW9QHzNrM7R9LX5dFELCBig' 
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
     
    if(imagesNumber == 0){
      const createdAnswer=new AnswerSchema({answer:answer,question:question,answeredBy:user._id})
      
      createdAnswer.save()
      .then(() => { 
    
         QuestionSchema.findOneAndUpdate({_id:question},{answertoshow:createdAnswer._id})
         .then(() =>{
            return res.status(200).json({message:"Answer added successfully."})
         })
        })
      .catch(err => {return res.status(500).json({message:"Internal error occured! Try again "})});
    }
    else if(imagesNumber >0){
         urls= await upload(imagesNumber,images);

         const createdAnswer=new AnswerSchema({answer:answer,question:question,answeredBy:user._id,
            images: imagesNumber == 2 ? [ urls[0],urls[1] ]:[ urls[0] ] });
          
            createdAnswer.save()
            .then(() => { 
              QuestionSchema.findOneAndUpdate({_id:question},{answertoshow:createdAnswer._id})
              .then(() =>{
                return res.status(200).json({message:"Answer added successfully."})})
              })
            .catch(err => {return res.status(500).json({message:"Internal error occured! Try again "})});
    }
}

const getAllAnswers= async (req,res) =>{

  let answers= await AnswerSchema.find().populate([{path:"question",select:"name"},
  {path:"answeredBy",select:"username avatar"}]);
  answers[0]["nameMe"]="Kamara";
  console.log(answers[0]);

  return res.status(200).json({answers});
}

const getQuestionAnswers=async (req,res) =>{
     let questionId=req.params.questionId;
     
     try{
      let questionAnswers= await AnswerSchema.find({question:questionId}).populate([{path:"answeredBy",select:"username avatar isPro"}]);
      
      return res.status(200).json({questionAnswers});
     }catch(err){
      return res.status(500).json({error:"Internal error occured! Try again"})
     }
}

const upVote = async (req,res) =>{
    let answerId=req.body.answerId;
    let answerToUpvote=await AnswerSchema.findOne({_id:answerId});
    let newVote=answerToUpvote.upVotes+1;

    AnswerSchema.findOneAndUpdate({_id:answerId},{upVotes:newVote})
    .then(() =>{
      return res.status(200).json({message:"Voted successfully"});
    }).catch(err => {return res.status(500).json({error:"Internal error occured! Try again"})});
}

const downVote = async (req,res) =>{
  let answerId=req.body.answerId;
  let answerTodownvote=await AnswerSchema.findOne({_id:answerId});
  let newVote=answerTodownvote.downVotes+1;

  AnswerSchema.findOneAndUpdate({_id:answerId},{downVotes:newVote})
  .then(() =>{
    return res.status(200).json({message:"Down voted successfully"});
  }).catch(err => {return res.status(500).json({error:"Internal error occured! Try again"})});
}

module.exports={addAnswer,getQuestionAnswers,upVote,downVote,getAllAnswers};