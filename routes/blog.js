var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var Blog = require("../models/blog")
var passport = require("passport")
var middleware = require("./middleware")
var multer = require("multer")

//show all blogs
router.get("/blog", middleware.isLoggedIn, function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err)
            res.redirect("/")
        } else {
            res.render("showBlog", { blogs: blogs })
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
    Blog.findById(req.params.blog_id, function (err, foundBlog) {
        if (err) {
            console.log(err)
        } else {
            res.render("showBlogSpecific", { blog: foundBlog })
        }
    })
})


//create
router.post("/blog", middleware.isLoggedIn, upload.single('fileupload'), function (req, res) {
    console.log(req.body.blog)
    console.log(req.user)
    console.log(req.file)
    if (req.file) {
        //res.json({file:req.file});
        var imgBody = {
            fileName: req.file.originalname,
            encoding: req.file.encoding,
            contentType: req.file.mimetype,
            data: req.file.buffer
        }
        //console.log(imgBody)
        var blogBody = req.body.blog
        Image.create(imgBody, function (err, newImage) {
            if (err) {
                console.log(err)
            } else {
                console.log("======Created Image======")
                console.log(newImage.data)
                //res.redirect("/image")
                Blog.create(blogBody, function (err, newBlog) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("======Created Blog======")
                        console.log(newBlog)
                        newBlog.image = newImage;
                        res.redirect("/blog/"+newBlog._id)
                    }
                })
            }
        })
    }
})

//edit
router.get("/blog/:blog_id/edit", middleware.checkBlogOwnership, function (req, res) {
    Blog.findById(req.params.blog_id, function (err, foundBlog) {
        if (err) {
            console.log(err)
        } else {
            console.log(foundBlog)
            res.render("editBlog", { blog: foundBlog })
        }
    })
})

//update
router.put("/blog/:blog_id", middleware.checkBlogOwnership, function (req, res) {
    Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, function (err, newBlog) {
        if (err) {
            console.log(err)
        } else {
            console.log(newBlog)
            res.redirect("/blog/" + req.params.blog_id)
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