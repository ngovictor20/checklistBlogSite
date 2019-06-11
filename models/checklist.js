var mongoose = require("mongoose");
var checklistSchema = new mongoose.Schema({
    title: String,
    checklistItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChecklistItem"
    }],
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    }
})              
  
module.exports = mongoose.model("Checklist", checklistSchema);
