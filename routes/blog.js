var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("../models/user");
var Blog = require("../models/blog")
var Image = require("../models/image")
var passport = require("passport")
var middleware = require("./middleware")
var multer = require("multer")
var upload = multer()

//show all blogs
router.get("/blog", middleware.isLoggedIn, function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err)
            res.redirect("/")
        } else {
            res.render("./blogs/showBlog", { blogs: blogs })
        }
    })
})
//show new form
router.get("/blog/new", middleware.isLoggedIn, function (req, res) {
    res.render("./blogs/newBlog")
})

//specific blog
router.get("/blog/:blog_id", function (req, res) {
    console.log(req.params.blog_id)
    Blog.findById(req.params.blog_id).populate("image").exec(function (err, foundBlog) {
        if (err) {
            console.log(err)
        } else {
            console.log(foundBlog)
            res.render("./blogs/showBlogSpecific", { blog: foundBlog })
        }
    })
})


//create
router.post("/blog", middleware.isLoggedIn, upload.single('fileupload'), function (req, res) {
    console.log(req.body.blog)
    console.log(req.user)
    console.log(req.file)
    if (req.file && req.file.buffer.byteLength() != 0) {
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
                //console.log(newImage.data)
                //res.redirect("/image")
                blogBody.image = newImage
                Blog.create(blogBody, function (err, newBlog) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("======Created Blog======")
                        //console.log(newBlog)
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
            res.render("./blogs/editBlog", { blog: foundBlog })
        }
    })
})

//update
router.put("/blog/:blog_id", middleware.checkBlogOwnership, upload.single("fileupload"), function (req, res) {
    let imgBody
    Blog.findById(req.params.blog_id).populate("image").exec(function(err,newBlog){
        if(req.file && Buffer.compare(req.file.buffer,newBlog.image.data) != 0){
            imgBody = {
                fileName: req.file.originalname,
                encoding: req.file.encoding,
                contentType: req.file.mimetype,
                data: req.file.buffer
            }
            if(req.file.buffer.byteLength() != 0){
                Image.create(imgBody,function(err,newImage){
                    if(err){
                        console.log("something went wrong")
                    }else{
                        console.log("created new image")
                        newBlog.image = newImage
                    }
                })
            }
        }else{
            newBlog.title = req.body.blog.title
            newBlog.text = req.body.blog.text
        }
        newBlog.save()
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