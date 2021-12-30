const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const AddsSchema=new Schema({
    name:{
        type:String
    },
    addLightImage:{
        type:String
    },
    addDarkImage:{
        type:String
    },
    addLink:{
        type:String
    },
    clicks:{
        type:Number
    }
})

module.exports=mongoose.model("adds",AddsSchema);