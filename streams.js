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
var upload = multer()


const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine','ejs')
app.set('views', './views')

//Mongo URI
const mongoURI = "mongodb://127.0.0.1:27017/myapp"

//mongo connection
//var conn = mongoose.createConnection(mongoURI,{useNewUrlParser: true})

//Init gfs
let gfs

mongoose.connect(mongoURI, { useNewUrlParser: true }, function () {
  console.log(mongoose.connection.readyState);
  //seedDB();
  Blog.find({}, function (err, blog) {
    if (err) {
      console.log(err);
    } else {
      console.log("Printing blogs")
      console.log(blog);
    }
  })
});

// conn.once('open', function () {
//   init stream
//   console.log(mongoose.connection.readyState)
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads') 
//   console.log("opened")
// })



//create storage engine
// var storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });

//routes


app.get('/',function(req,res){
  Blog.find({}).populate("imgFile").exec(function(err,blogs){
    console.log("printing")
    console.log(blogs)
    // blogs.forEach((blog)=>{
    //   gfs.findOne({_id:blog.imgFile},function(err,file){
    //     if(err){
    //       console.log(err)
    //     }else{
    //       console.log(file)
    //     }
    //   })
    // })
    // gfs.files.findOne({_id:blogs[0].imgFile},function(err,file){
    //   console.log("test")
    //   console.log(file)
    // })
  })
  res.render('newBlog1.ejs')
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
//5cf5bb693b5f7fb6ede2b76b



app.listen(port,hostname,()=>{
  console.log("Server started on port 5000")
})