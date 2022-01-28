const Comment=require("../../Models/CommentSchema");
const Answer=require("../../Models/AnswerSchema");

const getAnswerComments= async (req,res) =>{
   let answerId=req.body.answerId;
   try{
     let answerComments=await Comment.find({answerId:answerId}).populate({path:"commentedBy",select:"_id username avatar isPro"});
     return res.status(200).json({answerComments});

   }catch(err){
    return res.status(500).json({error:"An internal error occurred!"});
   }
}

const addComment = async (req,res) =>{
 let {answerId,comment}=req.body;
 if(!answerId || comment == "")
   return res.status(400).json({error:"Please fill provide all details"});

 try{
   let {comments}=await Answer.findById({_id:answerId});
   
   let newComment=new Comment({commentedBy:req.user._id,answerId:answerId,comment:comment});

   let save=await newComment.save();
   comments.push(save._id);
     
   await Answer.findByIdAndUpdate({_id:answerId},{comments:comments});

   let commentToSend=await Comment.findById({_id:save._id}).populate({path:"commentedBy",select:"username avatar isPro"});
   
   return res.status(200).json({message:"Comment added successfully",addedComment:commentToSend});   

 }catch(err){
     console.log("Adding comment Error: ",err);
     return res.status(500).json({error:"An internal error occurred!"});
 }

}

module.exports={addComment,getAnswerComments};

