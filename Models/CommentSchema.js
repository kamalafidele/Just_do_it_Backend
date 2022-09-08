const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    answerId: {
        type: Schema.Types.ObjectId,
        ref: "answers"
    },
    comment: {
        type: String
    }
});

CommentSchema.pre("find", function(next){
    this.populate({ path:"commentedBy",select: "username avatar isPro"});
    next();
})

CommentSchema.pre("findById", function(next){
    this.populate({path:"commentedBy", select: "username avatar isPro"});
    next();
})

module.exports = model("comments", CommentSchema);