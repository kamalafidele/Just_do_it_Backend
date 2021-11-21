const mongoose=require("mongoose");
const bcrypt=require("bcrypt");


const UserSchema=new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    avatar:{
        type:String
    },
    status:{
        type:String,
        enum:["Pending","Active"],
        default:"Pending"
    },
    uniqueCode:{
        type:String
    },
    isGoogleUser:{
        type:Boolean
    },
    isPro:{
        type:Boolean,
        default:false
    }
});

//ADDING HASHING FUNCTION
UserSchema.pre("save", function(next){
    let user=this;
    if(user.isModified("password")){
        bcrypt.genSalt(8, function(err,salt){
            if(err){
                console.log("BCRYPT ERROR ");
                next();
            }else{
                bcrypt.hash(user.password,salt,function(err,hash){
                    if(err){
                      console.log("HASHING PASSWORD FAILED ");
                      next();
                    }
                    user.password=hash;
                    next();
                })
            }

        })
    }else{
        next();
    }
});

UserSchema.methods.comparePassword=function (password,next) {
    bcrypt.compare(password, this.password, function(err,match){
        if(err){
            console.log("COMPARING PASSWORD ERROR ",err);
            next(err,false);
            return;
        }else{
            next(null,match);
            return;
        }
    });
}

module.exports=mongoose.model("user",UserSchema);
