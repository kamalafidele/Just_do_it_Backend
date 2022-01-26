const AddsSchema=require("../../Models/AddsSchema");

const getAllAdds=async (req,res) =>{
    try{
     let adds=await AddsSchema.find();
     return res.status(200).json({adds});

    }catch(err){
        return res.status(500).json({error:err});
    }
}

const getSingleAdd = async (req,res) =>{
    try{
      let addId=req.params.addId;
      let add=await AddsSchema.findById({_id:addId});
      return res.status(200).json({add});

    }catch(err){
        return res.status(500).json({error:err});
    }
}

async function addAdd (req,res){
    const {name,addLightImage,addDarkImage,addLink}=req.body;

    if(!name || name == "" || !addLightImage || !addDarkImage || !addLink)
      return res.status(200).json({error:"Please provide all add details"});

    try{
    let add=new AddsSchema({name:name,addLightImage:addLightImage,addDarkImage:addDarkImage,addLink:addLink,clicks:0});
    await add.save();
    return res.status(200).json({message:"Add added successfully"});

    }catch(err){
        return res.status(500).json({error:err});
    }
}

const updateAddClicks = async (req,res) =>{
    let {addId,newClicks}=req.body;
    
    try{
     
      await AddsSchema.findOneAndUpdate({_id:addId},{$set:{clicks:newClicks}},{new:true});
      
      return res.status(200).json({message:"Clicks updated successfully"});
    }catch(err){
        return res.status(500).json({error:"Internal error occurred while updating clicks"});
    }
}

module.exports={getAllAdds, getSingleAdd,addAdd, updateAddClicks};