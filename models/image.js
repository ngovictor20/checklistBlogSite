var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
    contentType : String,
    image: Buffer, //maybe we should store photos
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    }
})              
  
module.exports = mongoose.model("Image", imageSchema);