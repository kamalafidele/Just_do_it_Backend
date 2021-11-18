const mongoose=require("mongoose");
const Schema=mongoose.Schema;

let notificationSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    notificationMessage:{
        type:String
    }
})

module.exports=mongoose.model("notification",notificationSchema);