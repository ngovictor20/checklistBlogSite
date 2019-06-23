var User = require("../models/user")
var Checklist = require("../models/checklist")
var ChecklistItem = require("../models/checklistItem")
var Blog = require("../models/blog")
middle = {}

// String.prototype.equals = function(that) {
//     return this === that;
// }

middle.isLoggedIn = function(req,res,next){
    console.log(req.user)
    if(!req.user){
        console.log("User is not logged in")
        res.redirect("/")
    }else{
        console.log("User is logged in")
        next();
    }
}


middle.checkChecklistOwnership = function(req,res,next){
    //console.log("======================================")
    //console.log(req.user)
    if(!req.user){
        console.log("User is not logged in")
        res.redirect("/")
    }else{
        //console.log("User is logged in")
        //check the checklist
        //assume req.params.checklist_id is always available
        console.log("checking checklist")
        Checklist.findById(req.params.checklist_id).populate("user.id").exec(function(err,checklist){
            if(err){
                console.log("error in the checking")
                console.log(err)
                res.redirect("/")
            }else{
                //console.log("check if is owner")
                //console.log(checklist.user.id)
                //check if checklist's owner matches req.user
                if(checklist.user.id.equals(req.user._id)){
                    //console.log("is owner")
                    next()
                }else{
                    //console.log("is not owner")
                    res.redirect("/checklist")
                }
            }
        });
    }

}


middle.checkBlogOwnership = function(req,res,next){
    if(!req.user){
        console.log("User is not logged in")
        res.redirect("/")
    }else{
        console.log("checking blog")
        Blog.findById(req.params.blog_id).populate("user.id").exec(function(err,foundblog){
            if(err){
                console.log(err)
            }else{
                if(foundblog.user.id.equals(req.user._id)){
                    //console.log("is owner")
                    next()
                }else{
                    //console.log("is not owner")
                    res.redirect("/blog")
                }
            }
        })
    }

}
module.exports = middle;