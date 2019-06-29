var express = require("express")
var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override")
//var fileUpload = require("express-fileupload")
var Grid = require("gridfs-stream")
var multer = require("multer")
var crypto = require('crypto')
var path = require('path')
var GridFsStorage = require('multer-gridfs-storage')
var http = require('http');
var User = require("./models/user");
var ChecklistItem = require("./models/checklistItem")
var Checklist = require("./models/checklist")
var indexRoute = require("./routes/index");
var checklistRoute = require("./routes/checklist");
var checklistItemRoute = require("./routes/checklistItem")
var authRoute = require("./routes/auth")
var blogRoute = require("./routes/blog")
var seedDB = require("./seed");
const passportLocalMongoose = require('passport-local-mongoose');
//const hostname = '127.0.0.1';
const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;
const mongoURI = "mongodb://127.0.0.1:27017/myapp"

passport.use(new LocalStrategy(User.authenticate()));
var app = express();
app.set('views', './views')
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));
//app.use(fileUpload())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
  secret: 'anything',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})
//{limits: { fileSize: 50 * 1024 * 1024 }}
app.use(indexRoute);
app.use(checklistRoute);
app.use(checklistItemRoute)
app.use(authRoute);
app.use(blogRoute)


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose.connect("mongodb+srv://victoradmin:Harpie25@checklistapp-afjm1.mongodb.net/checklistApp?retryWrites=true&w=majority", { useNewUrlParser: true }, function () {
//   console.log(mongoose.connection.readyState);
//   //seedDB();
//   User.find({}, function (err, users) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Printing users")
//       console.log(users);
//     }
//   })
// });

// mongoose.connect("mongodb://127.0.0.1:27017/myapp", { useNewUrlParser: true }, function () {
//   console.log(mongoose.connection.readyState);
//   //seedDB();
//   User.find({}, function (err, users) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Printing users")
//       console.log(users);
//     }
//   })
// });

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


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
