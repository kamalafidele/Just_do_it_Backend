const router=require("express").Router();

const {getNotifications,deleteNotification} = require("../controllers/notifications/notifications");

router.get("/",getNotifications);
router.delete("/:id",deleteNotification);

module.exports=router;