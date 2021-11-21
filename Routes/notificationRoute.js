const router=require("express").Router();

const {getNotifications,deleteNotification} = require("../Controllers/notifications/notifications");

router.get("/notifications",getNotifications);
router.delete("/:id",deleteNotification);

module.exports=router;