const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const ResetSchema=new Schema({
    userId:{
    type:Schema.Types.ObjectId,
    ref:"users"
    },
    uniqueNumber:{
        type:String
    }
});

module.exports=mongoose.model("resetpassword",ResetSchema);