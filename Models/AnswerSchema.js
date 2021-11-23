const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const AnswerSchema=new Schema({
    answer:{type:String},
    question:{
        type:Schema.Types.ObjectId,
        ref:"questions"
    },
    answeredBy:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    upVotes:{
        type:Number,
        default:0
    },
    downVotes:{
        type:Number,
        default:0
    },
    images:[{type:String}]
},{timestamps:true});

module.exports=mongoose.model("answers",AnswerSchema);