var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var ChecklistItem = require("../models/checklistItem")
var Checklist = require("../models/checklist")


router.get("/",function(req,res){
    //console.log(req.session); //req.user is created using sessions middleware
    res.render("./index/home");
})



module.exports = router;