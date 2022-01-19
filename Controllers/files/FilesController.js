const router = require('express').Router();
const User = require("../../Models/UserSchema");
const cloudinary = require('cloudinary');
const NotificationSchema=require("../../Models/Notifications");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadProfilePicture = async (req,res) =>{
    let user=req.user;
    let {image,username}=req.body;
    if(username  !== user.username && !image){

      try{
        await   User.findByIdAndUpdate({_id:req.user._id},{username:username});
        let notification=new NotificationSchema({user:user._id,notificationMessage:` You  have changed your profile details successfully.`});
        await notification.save();
    
        return  res.status(200).json({message:"Profile details changed successfully",newUsername:username});
      }catch(err){
        return res.status(500).json({error:"Error occurred. Try again !"});
      }

    }else{
        if(!image){
            return res.status(400).json({error:"Please choose an image"});
        }
    
        try{
            const uploadedImage = await cloudinary.v2.uploader.upload(image,{
                folder: 'users/images',
                allowed_formats:['png','jpg','webp','svg','jfif'] });
    
        const update=await   User.findByIdAndUpdate({_id:req.user._id},{avatar:uploadedImage.url,username:username});
        let notification=new NotificationSchema({user:user._id,notificationMessage:` You  have changed your profile details successfully.`});
        let hasSaved=await notification.save();
    
        return  res.status(200).json({message:"Profile details changed successfully",newProfile:uploadedImage.url,newUsername:username});
    
        }catch(err){
            console.log("Uploading profile picture error: ",err);
           return res.status(500).json({error:"Error occurred. Try again !"});
        }
    }
}


module.exports = {uploadProfilePicture}
