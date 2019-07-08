var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var ChecklistItem = require("../models/checklistItem")
var Checklist = require("../models/checklist")

//For AJAX calls

//CREATE
router.post("/checklist/:checklist_id/create", function(req,res){
    console.log(req.body.value)
    Checklist.findById(req.params.checklist_id,function(err,checklist){
        if(err){
            console.log(err)
        }else{
            ChecklistItem.create({
                complete: false,
                action: req.body.value
            },function(err,newItem){
                if(err){
                    console.log(err)
                }else{
                    //console.log("created: " + newItem)
                    checklist.checklistItem.push(newItem)
                    checklist.save(function(err,outcome){
                        console.log("save successful")
                        res.send(newItem)
                    })
                }
            })
        }
    })
})

//UPDATE complete status
router.put("/checklist/:checklist_id/:checklistItem/",function(req,res){
    Checklist.findById(req.params.checklist_id,function(err,checklist){
        if(err){
            res.redirect("/")
            res.send(err)
        }else{
            //console.log(req.body.value)
            ChecklistItem.findById(req.body.id,function(err,foundchecklistItem){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    foundchecklistItem.complete = !foundchecklistItem.complete
                    foundchecklistItem.save()
                    res.send(foundchecklistItem)
                }
            })
        }
    })
})

//DELETE
router.delete("/checklist/:checklist_id/:checklistItem/", function(req,res){
    Checklist.findById(req.params.checklist_id,function(err,checklist){
        if(err){
            res.redirect("/")
            res.send(err)
        }else{
            ChecklistItem.findByIdAndDelete(req.body.id,function(err,response){
                if(err){
                    console.log(err)
                    res.send("hi")
                }else{
                    console.log("delete successful")
                    //console.log(response)
                    res.send("hi")
                    //probably send something more legit to the client
                }
            })
        }
    })
})


module.exports = router;