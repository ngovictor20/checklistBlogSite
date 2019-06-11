var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var ChecklistItem = require("../models/checklistItem")
var Checklist = require("../models/checklist")
var middleware = require("./middleware")

//SHOW
router.get("/checklist", middleware.isLoggedIn, function (req, res) {
    function asyncaction(x){
        return new Promise(function(resolve,reject){
            Checklist.findById(x).populate("checklistItem").exec(function(err,checklist){
                if(err){
                    return reject(err)
                }
                return resolve(checklist)
            })
        })
    }
    var promises = []
    var checklistObj = []
    User.findById(req.user._id).populate("checklists").exec(function (err, foundUser) {
        if (err) {
            console.log("err")
            res.redirect("/");
        } else {
            console.log("===============================")
            console.log(foundUser.checklists)
            for (i = 0; i < foundUser.checklists.length; i++) {
                promises.push(asyncaction(foundUser.checklists[i]._id)) //grab each checklist object so we can pass it into the response
            }

            Promise.all(promises).then((results)=>{
                console.log(results)
                checklistObj = results
                console.log("=====checklist obj======")
                console.log(checklistObj)
                res.render("showChecklists", { checklists: checklistObj })
            })
        }
        //issue is that we're not populating checklistItem in each checklist, so items are no longer being shown (not a big deal)
        
        //res.render("showChecklists", { checklists: foundUser.checklists })
    })

    // Checklist.find({}).populate("checklistItem").exec(function(err,checklistss){
    //     if(err){
    //         console.log("err")
    //         res.redirect("/");
    //     }else{
    //         res.render("showChecklists",{checklists:checklistss})
    //     }
    // })
});

//NEW
router.get("/checklist/new",middleware.isLoggedIn,function(req,res){
    res.render("newChecklist");
})

//SHOW
router.get("/checklist/:checklist_id/",middleware.checkChecklistOwnership, function(req,res){
    Checklist.findById(req.params.checklist_id).populate("checklistItem").exec(function(err,checklist){
        if(err){
            console.log(err)
        }else{
            //console.log(checklist)
            res.render("showChecklistSpecific",{checklist: checklist});
        }
    });
});

//CREATE
router.post("/checklist/",middleware.isLoggedIn, function (req, res) {
    var arr = req.body.item.action
    var mapping
    var checklistObj
    checklistObj = {
        title:req.body.checklist.title,
        user:{
            id: req.user._id,
            username: req.user.username
        }
    }

    if(arr.length > 1){
        var filtered = arr.filter(x => x != "")
        console.log(filtered)
        mapping = filtered.map(function(x){
            if(x != ""){
                return {'action':x}
            }
        })
    }else{
        mapping = {action: arr} 
    }
    console.log(mapping)
    Checklist.create(checklistObj,function(err,newChecklist){
        if(err){
            console.log(err)
        }else{
            ChecklistItem.insertMany(mapping,function(err,items){
                console.log(items)
                items.forEach(function(i){
                    console.log(i)
                    newChecklist.checklistItem.push(i)
                })
                newChecklist.save()
                console.log(newChecklist)
                User.findById(req.user._id,function(err,user){
                    if(err){
                        console.log(err)
                    }else{
                        user.checklists.push(newChecklist)
                        user.save()
                        console.log(user)
                        res.redirect("/checklist")
                    }
                })
            })
        }
    })
    
})

//EDIT
router.get("/checklist/:checklist_id/edit",middleware.checkChecklistOwnership,function(req,res){
    Checklist.findById(req.params.checklist_id).populate("checklistItem").exec(function(err,checklist){
        if(err){
            console.log(err)
        }else{
            console.log(checklist)
            res.render("editChecklist",{checklist: checklist});
        }
    });
})

//UPDATE
router.put("/checklist/:checklist_id/",middleware.checkChecklistOwnership,function(req,res){
    console.log("put request")
    console.log(req.body)
    Checklist.findById(req.params.checklist_id).populate("checklistItem").exec(function(err,checklist){
        if(err){
            console.log(err)
        }else{
        var count = 0
        checklist.checklistItem.forEach(function(item){
            item.action = req.body.item[count];
            item.save(function(err,outcome){
                console.log("save successful")
            })
            count++;
        })
        checklist.save(function(err,outcome){
            console.log("Checklist saved")
        })
        res.redirect("/checklist/"+req.params.checklist_id)
        }
    })
    
})

//DELETE
router.delete("/checklist/:checklist_id/",middleware.checkChecklistOwnership,function(req,res){
    Checklist.findByIdAndDelete(req.params.checklist_id,function(err,resp){
        if(err){
            res.redirect("/");
        }else{
            console.log("Delete successful")
            res.redirect("/checklist")
        }
    })
})





module.exports = router;