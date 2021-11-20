const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const QuestionSchema=new Schema({
    question:{type:String},
    topic:{
        type:Schema.Types.ObjectId,
        ref:"workspaces"
    },
    askedBy:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    votes:{
        type:Number,
        default:0
    },
    images:[{type:String}]
});

module.exports=mongoose.model("questions",QuestionSchema);