var mongoose = require("mongoose");
var blogSchema = new mongoose.Schema({
    title: String,
    text: String,
    image: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }, //maybe we should store photos
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    metadata: {
        date: {type: String, default : new Date()},
        tags: [String]
    }
})              
  
module.exports = mongoose.model("Blog", blogSchema);