const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema({
  name: {
      type: String
  },
  description: {
      type: String
  },
  picture: {
      type: String
  },
  creator: {
      type: Schema.Types.ObjectId,
      ref: "users"
  }
});

module.exports = mongoose.model("workspaces", WorkspaceSchema);