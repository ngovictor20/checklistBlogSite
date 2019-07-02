var mongoose = require("mongoose");
var app = require("express")()
var User = require("./models/user");
var ChecklistItem = require("./models/checklistItem")
var Checklist = require("./models/checklist")
var Blog = require("./models/blog")
var Image = require("./models/image")
var fs = require("fs")
var multer = require("multer")
var crypto = require('crypto')
var path = require('path')
var bodyParser = require("body-parser");
var methodOverride = require("method-override")

const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine','ejs')
app.set('views', './views')

//Mongo URI
const mongoURI = "mongodb://127.0.0.1:27017/myapp"

mongoose.connect(mongoURI,{useNewUrlParser : true}, function(){
  User.find({},function(err, blogs){
    console.log(blogs)
  })
})

app.get('/',function(req,res){
  Blog.find({},function(err, blogs){
    if(err){}else{
      res.render('newBlog1.ejs',blogs)
    }
  })
})
app.post('/',upload.single('fileupload'),function(req,res){
  res.json({file:req.file});
  var blogBody = req.body.blog
  blogBody.image = req.file
  Image.create({contentType : req.file.mimeType, image: req.file}, function(err, newImage){
      Blog.create(blogBody, function(err,newBlog){
        if(err){
          console.log(err)
        }
        else{
          console.log(newBlog)
          res.redirect("/")
        }
      })
  })
})


app.listen(port,hostname,()=>console.log("Server started on port 5000"))