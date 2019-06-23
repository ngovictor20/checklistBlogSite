var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var Blog = require("../models/blog")
var passport = require("passport")
var middleware = require("./middleware")

//show all blogs
router.get("/blog", middleware.isLoggedIn, function (req, res) {
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err)
            res.redirect("/")
        }else{
            res.render("showBlog",{blogs:blogs})
        }
    })
})
//show new form
router.get("/blog/new", middleware.isLoggedIn, function (req, res) {
    res.render("newBlog")
})

//specific blog
router.get("/blog/:blog_id", function (req, res) {
    console.log(req.params.blog_id)
    Blog.findById(req.params.blog_id,function(err,foundBlog){
        if(err){
            console.log(err)
        }else{
            res.render("showBlogSpecific",{blog:foundBlog})
        }
    })
})


//create
router.post("/blog", middleware.isLoggedIn, function (req, res) {
    console.log(req.body.blog)
    console.log(req.user)
    if(req.files){
        console.log(req.files)
    }
    // createBlog(req.body.blog).then(function (blog) {
    //     User.findById(req.user._id, function (err, currUser) {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             currUser.blogs.push(blog)
    //             currUser.save()
    //             console.log("New")
    //             console.log(currUser)
    //         }
    //     })
    //     res.redirect("/blog")
    // })

    // Blog.create(req.body.blog, function (err, newBlog) {
    //     if (err) {
    //         console.log(err)
    //         reject(err)

    //     } else {
    //         newBlog.user.id = req.user._id
    //         newBlog.user.username = req.user.username
    //         console.log("saving newBlog")
    //         newBlog.save()
    //         console.log(newBlog)
    //         User.findById(req.user._id, function (err, currUser) {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 currUser.blogs.push(newBlog)
    //                 currUser.save()
    //                 console.log("New")
    //                 console.log(currUser)
    //                 res.redirect("/blog")
    //             }
    //         })
    //     }
    // })
})

//edit
router.get("/blog/:blog_id/edit",middleware.checkBlogOwnership, function (req, res) {
    Blog.findById(req.params.blog_id,function(err,foundBlog){
        if(err){
            console.log(err)
        }else{
            console.log(foundBlog)
            res.render("editBlog",{blog:foundBlog})
        }
    })
})

//update
router.put("/blog/:blog_id",middleware.checkBlogOwnership, function (req, res) {
    Blog.findByIdAndUpdate(req.params.blog_id,req.body.blog,function(err,newBlog){
        if(err){
            console.log(err)
        }else{
            console.log(newBlog)
            res.redirect("/blog/"+req.params.blog_id)
        }
    })
})



var createBlog = function (blogObject) {
    return Promise(function (resolve, reject) {
        Blog.create(blogObject, function (err, newBlog) {
            if (err) {
                console.log(err)
                reject(err)

            } else {
                newBlog.user.id = req.user._id
                newBlog.user.username = req.user.username
                console.log("saving newBlog")
                newBlog.save()
                resolve(newBlog)
            }
        })
    })
}


module.exports = router;