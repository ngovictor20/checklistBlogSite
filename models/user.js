var mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    checklists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Checklist"
        }
    ]
})


userSchema.plugin(passportLocalMongoose)
//passport mongoose
module.exports = mongoose.model("User", userSchema);