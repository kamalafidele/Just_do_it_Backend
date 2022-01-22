const mongoose=require("mongoose");
const Schema=mongoose.Schema;

let notificationSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    notificationMessage:{
        type:String
    },
    video:{
        type:String
    },
    hasVideo:{
        type:Boolean
    },
    image:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

module.exports=mongoose.model("notification",notificationSchema);