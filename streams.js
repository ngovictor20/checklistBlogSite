var mongoose = require("mongoose");
var app = require("express")()
var User = require("./models/user");
var ChecklistItem = require("./models/checklistItem")
var Checklist = require("./models/checklist")
var fs = require("fs")
var Grid = require("gridfs-stream")
var multer = require("multer")
var crypto = require('crypto')
var path = require('path')
var GridFsStorage = require('multer-gridfs-storage')
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

//mongo connection
var conn = mongoose.createConnection(mongoURI,{ useNewUrlParser: true })

//Init gfs
let gfs

conn.once('open', function () {
  //init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads') 
})

//create storage engine
var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//routes


app.get('/',function(req,res){
  res.render('newBlog1.ejs')
})
app.post('/',upload.single('fileupload'),function(req,res){
  res.json({file:req.file});
})


app.listen(port,hostname,()=>console.log("Server started on port 5000"))