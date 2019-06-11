var mongoose = require("mongoose");
var checklistItemSchema = new mongoose.Schema({
    complete: {type: Boolean, default: false},
    action: String,
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    }
})
  
module.exports = mongoose.model("ChecklistItem", checklistItemSchema);
