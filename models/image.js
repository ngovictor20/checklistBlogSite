var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
    fileName: String,
    encoding: String,
    contentType : String,
    data: Buffer, //maybe we should store photos
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    }
})              
  
module.exports = mongoose.model("Image", imageSchema);