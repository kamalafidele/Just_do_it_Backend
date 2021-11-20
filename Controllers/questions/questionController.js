const QuestionSchema=require("../../Models/QuestionSchema");
const cloudinary=require("cloudinary");

cloudinary.config({ 
    cloud_name: 'justdoit', 
    api_key: '959232878426886', 
    api_secret: 'HdJRQW9QHzNrM7R9LX5dFELCBig' 
  });

async function upload(imagesNum,imagedata){
    let imagesUrl=[];
    let img;
    for(let i=0; i<imagesNum; i++){
        img = await cloudinary.v2.uploader.upload(imagedata[i],{folder: 'questionImages/images',
            allowed_formats:['png','jpg','webp','svg','jfif']});
            imagesUrl.push(img.url);
     }
 
     return imagesUrl;
}

const addQuestion= async (req,res) =>{
    let {topic,question,images}=req.body;
    let user=req.user;

    let imagesNumber=images.length;
     
    
    if(imagesNumber == 0){
      const createdQuestion=new QuestionSchema({question:question,topic:topic,askedBy:user._id})
      createdQuestion.save()
      .then(() => { return res.status(200).json({message:"Question added successfully."})})
      .catch(err => { console.log("Adding question ERR: ",err); return res.status(500).json({message:"Internal error occured! Try again "})});
    }
    else if(imagesNumber >0){
         urls= await upload(imagesNumber,images);

         const createdQuestion=new QuestionSchema({question:question,topic:topic,askedBy:user._id,
            images: imagesNumber == 2 ? [ urls[0],urls[1] ]:[ urls[0] ] });
          
            createdQuestion.save()
            .then(() => { return res.status(200).json({message:"Question added successfully."})})
            .catch(err => {return res.status(500).json({message:"Internal error occured! Try again "})});
    }
}

const getAllQuestions= async (req,res) =>{

  let questions= await QuestionSchema.find().populate([{path:"topic",select:"name picture"},
  {path:"askedBy",select:"username avatar"},{path:"answertoshow"}]);

  return res.status(200).json({questions});
}

const getTopicQuestions=async (req,res) =>{
     let workspaceId=req.params.workspaceId;
     
    let topicQuestions= await QuestionSchema.find({topic:workspaceId}).populate([{path:"topic",select:"name picture"},
    {path:"askedBy",select:"username avatar"},{path:"answertoshow"}]);

    return res.status(200).json({topicQuestions});
}



module.exports={addQuestion,getTopicQuestions,getAllQuestions};