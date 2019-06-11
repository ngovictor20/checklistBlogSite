var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var ChecklistItem = require("../models/checklistItem")
var Checklist = require("../models/checklist")
var passport = require("passport")

router.get("/register",function(req,res){
    res.render("register")
})

router.post("/register",function(req,res){
    console.log(req.body)
    User.register(new User({username:req.body.username}),req.body.password,function(err,newUser){
        if(err){
            return res.render("register",{user: newUser})
        }else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/');
            })
        }
    })
})

router.get("/login",function(req,res){
    res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res) {
})

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/")
})

module.exports = router;