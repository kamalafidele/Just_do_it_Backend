const router = require('express').Router();
const User = require("../../models/UserSchema");
const cloudinary = require('cloudinary');
const NotificationSchema=require("../../models/Notifications");


cloudinary.config({ 
    cloud_name: 'find-yours', 
    api_key: '695834136925863', 
    api_secret: 'uKrKes5HpRWPLldPjOg7OWUh6B4' 
  });

router.post("/upload-profile", async (req,res)=>{ 
    let user=req.user;
    console.log(req.body);
    // if(!req.body.itemPhoto){
    //     return res.status(400).json({error:"Please choose an image"});
    // }


    // const image = await cloudinary.v2.uploader.upload(req.body.itemPhoto,{
    //     folder: 'users/images',
    //     allowed_formats:['png','jpg','webp','svg','jfif']
        
    // });

    // User.findByIdAndUpdate({_id:req.user._id},{avatar:image.url})
    //    .then( async (result) =>{

    

    //     let notification=new NotificationSchema({user:user._id,isFinished:false,
    //       notificationMessage:` You  have changed your profile picture successfully.`});

    //    notification.save()
    //    .then(() =>{
    //     return  res.status(200).json({message:"Image uploaded successfully",newProfile:image.url});
    //    });   

    //    })
    //    .catch(err =>{

    //        console.log(err);
    //        return res.status(400).json({error:"Error occurred. Try again !"});
    //    })

});


module.exports = router
