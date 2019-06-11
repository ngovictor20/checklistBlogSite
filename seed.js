var mongoose = require("mongoose");
var User = require("./models/user");
var ChecklistItem = require("./models/checklistItem")
var Checklist = require("./models/checklist")



var userData = {
    username: "remisint",
    firstName: "Victor",
    lastName: "Ngo",
    password: "password"
}

function seedDB(){
    User.create(userData,function(err,newuser){
        var checklistData = [
            {
                title: "Checklist1",
                user: {
                    id: newuser._id,
                    username: newuser.username
                }
            },{
                title: "Checklist2",
                user: {
                    id: newuser._id,
                    username: newuser.username
                }
            },{
                title: "Checklist3",
                user: {
                    id: newuser._id,
                    username: newuser.username
                }
            }
        ]
        checklistData.forEach(function(data){
            Checklist.create(data,function(err,newCheck){
                if(err){
                    console.log(err);
                }else{
                    console.log("created a new checklist")
                    console.log(newCheck)
                }
            })
        })
    })
}

module.exports = seedDB;