const router = require('express').Router();
const User = require("../../models/UserSchema");
const cloudinary = require('cloudinary');
const NotificationSchema=require("../../models/Notifications");

cloudinary.config({ 
  cloud_name: 'justdoit', 
  api_key: '959232878426886', 
  api_secret: 'HdJRQW9QHzNrM7R9LX5dFELCBig' 
});

const uploadProfilePicture = async (req,res) =>{
    let user=req.user;
    let {image}=req.body;

    if(!image){
        return res.status(400).json({error:"Please choose an image"});
    }

    try{
        const uploadedImage = await cloudinary.v2.uploader.upload(image,{
            folder: 'users/images',
            allowed_formats:['png','jpg','webp','svg','jfif'] });

    const update=await   User.findByIdAndUpdate({_id:req.user._id},{avatar:uploadedImage.url});
    let notification=new NotificationSchema({user:user._id,notificationMessage:` You  have changed your profile picture successfully.`});
    let hasSaved=await notification.save();

    return  res.status(200).json({message:"Image uploaded successfully",newProfile:uploadedImage.url});

    }catch(err){
        console.log("Uploading profile picture error: ",err);
       return res.status(500).json({error:"Error occurred. Try again !"});
    }
}


module.exports = {uploadProfilePicture}
