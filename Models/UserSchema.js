const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending","Active"],
        default: "Pending"
    },
    uniqueCode: {
        type: String
    },
    isGoogleUser: {
        type: Boolean
    },
    isPro: {
        type: Boolean,
        default: false
    },
    darkMode: {
        type: Boolean,
        default: false
    }
});

//ADDING HASHING FUNCTION
UserSchema.pre("save", async function(next) {
    let user = this;
    if(user.isModified("password")){
        try {
         let salt = await bcrypt.genSalt(8);
         let hash =  await bcrypt.hash(user.password, salt);
         user.password = hash;
         next();

        } catch( e ) {
            console.log("BCRYPT ERROR ");
            next();
        }

    }else{
        next();
    }
});

UserSchema.methods.comparePassword = function (password,next) {
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

module.exports = mongoose.model("users", UserSchema);
