var mongoose = require("mongoose");
var blogSchema = new mongoose.Schema({
    title: String,
    text: String,
    image: String, //maybe we should store photos
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    }
})              
  
module.exports = mongoose.model("Blog", blogSchema);