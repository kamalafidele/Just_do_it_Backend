const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserWorkspaceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        unique: true
    },
    workspaces:[
        {
            type: Schema.Types.ObjectId,
            ref: "workspaces"
        }
    ]
});

module.exports = mongoose.model("userWorkspaces", UserWorkspaceSchema);