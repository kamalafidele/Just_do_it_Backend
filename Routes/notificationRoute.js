const router = require("express").Router();
const User = require("../Models/UserSchema");

const { getNotifications, deleteNotification } = require("../Controllers/notifications/notifications");

const updateUserMode = async (req,res) =>{
    let user = req.user;
    let modeStatus = req.params.modeStatus;

    try{
        await User.findOneAndUpdate({_id:user._id},{$set:{darkMode: modeStatus == "true" ?  true : false }},{new:true});
        
        return res.status(200).json({message:"User theme mode updated"});

    }catch(err){
        console.log("Updating userMode Error: ",err);
        return res.status(400).json({error:"Updating user mode failed"});
    }
}

router.get("/notifications",getNotifications);
router.delete("/:id",deleteNotification);
router.post("/userMode/:modeStatus",updateUserMode);

module.exports = router;