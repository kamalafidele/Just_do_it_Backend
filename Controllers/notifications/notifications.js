const NotificationSchema=require("../../Models/Notifications");

const getNotifications = async (req,res) =>{

    let id=req.user._id;

   await NotificationSchema.find({user:id}).sort({createdAt:"desc"})
         .then(notifications =>{
             return res.status(200).json({notifications:notifications});
         })
         .catch(err =>{
             return res.status(500).json({error:"Error occurred! Try again"});
         })
}

const deleteNotification= async (req,res) =>{
    let notificationId=req.params.id;
    let userId=req.user._id;

    NotificationSchema.findOneAndDelete({$and:[{_id:notificationId},{user:userId}]})
    .then(() =>{
        return res.status(200).json({message:"Notification deleted"});
    })

}

module.exports={getNotifications,deleteNotification};