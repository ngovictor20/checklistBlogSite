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
    let queryObject
    console.log(req.query)
    if (Object.keys(req.query).length != 0) {
        queryObject = {
            "metadata.tags": {
                $regex:req.query.tags,
                '$options' : 'i'
            },
            $or:[{"metadata.public": "true"},{"user.id":req.user._id}]
        }
    } else {
        queryObject = {
           $or:[{"metadata.public": "true"},{"user.id":req.user._id}]
        } //get stuff that are public or is your own blogs
    }
    console.log(queryObject)
    Blog.find(queryObject, function (err, blogs) {
        if (err) {
            console.log(err)
            res.redirect("/")
        } else {
            console.log(blogs)
            res.render("./blogs/showBlog", { blogs: blogs })
        }
    })
})

//show new form
router.get("/blog/new", middleware.isLoggedIn, function (req, res) {
    res.render("./blogs/newBlog")
})

//specific blog
router.get("/blog/:blog_id", middleware.isLoggedIn, function (req, res) {
    console.log(req.params.blog_id)
    Blog.findById(req.params.blog_id).populate("image").exec(function (err, foundBlog) {
        if (err) {
            console.log(err)
            res.redirect("/blog/")
        } else {
            console.log(foundBlog)
            if (foundBlog) {
                res.render("./blogs/showBlogSpecific", { blog: foundBlog })
            } else {
                res.redirect("/blog/")
            }
        }
    })
})


//create
router.post("/blog", middleware.isLoggedIn, upload.single('fileupload'), function (req, res) {
    console.log("New Blog Request")
    console.log(req.body)
    console.log(req.user)
    console.log(req.file)
    if (req.file && req.file.buffer.byteLength != 0) {
        //res.json({file:req.file});
        var imgBody = {
            fileName: req.file.originalname,
            encoding: req.file.encoding,
            contentType: req.file.mimetype,
            data: req.file.buffer
        }
        //console.log(imgBody)
        var blogBody = req.body.blog
        blogBody.user = {
            id: req.user._id,
            username: req.user.username
        }
        //console.log(req.body.metadata.tags.toString())
        //console.log(req.body.metadata.tags.toString().split(","))
        blogBody.metadata = {
            tags: req.body.metadata.tags.toString().split(","),
            public: req.body.metadata.public
        }
        console.log("====Blog Body====")
        console.log(blogBody)
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
                        res.redirect("/blog/" + newBlog._id)
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
    Blog.findById(req.params.blog_id).populate("image").exec(function (err, newBlog) {
        if (req.file && Buffer.compare(req.file.buffer, newBlog.image.data) != 0) {
            imgBody = {
                fileName: req.file.originalname,
                encoding: req.file.encoding,
                contentType: req.file.mimetype,
                data: req.file.buffer
            }
            if (req.file.buffer.byteLength != 0) {
                Image.create(imgBody, function (err, newImage) {
                    if (err) {
                        console.log("something went wrong")
                    } else {
                        console.log("created new image")
                        newBlog.image = newImage
                    }
                })
            }
        } else {
            newBlog.title = req.body.blog.title
            newBlog.text = req.body.blog.text
        }
        newBlog.save()
    })
})

//delete
router.delete("/blog/:blog_id", middleware.checkBlogOwnership, function (req, res) {
    Blog.findByIdAndDelete(req.params.blog_id, function (err, foundBlog) {
        if (err) {
            console.log(err)
        } else {
            console.log("Deleted blog")
            console.log(foundBlog);
            if (foundBlog.image._id) {
                Image.findByIdAndDelete(foundBlog.image._id, function (err, doc) {
                    if (err) {
                        console.log("Deleted blog but not image. Ran into issue")
                        console.log(err)
                        res.redirect("/blog/")
                    } else {
                        console.log("Successful Delete of Both Image and Blog")
                        console.log(doc)
                        res.redirect("/blog/")
                    }
                })
            }
        }
    })

})


module.exports = router;