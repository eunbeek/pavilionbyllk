var express = require("express");
var app = express();
var path = require("path");
var multer = require("multer");
var fs = require("fs");
var dser = require("./data-service.js");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var dataServiceAuth = require('./data-service-auth.js');
var clientSessions = require('client-sessions');
/********************Including Module************************/
// Port 
var HTTP_PORT = process.env.PORT || 8080;

// Access 
app.use(express.static("views"));
app.use(express.static("public"));

// URL encoding + File Upload
app.use(bodyParser.urlencoded({extended: true}));

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// express-handlebars
app.engine(".hbs", exphbs({ 
  extname: ".hbs", 
  defaultLayout:"main",
  helpers:{
    navLink: function(url, options){
      return '<li' +
      ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
      '><a href="' + url + '">' + options.fn(this) + '</a></li>';
     },

     equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
      return options.inverse(this);
      } else {
      return options.fn(this);
      }
     }
     
  }
}));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/")? "/" : route.replace(/\/$/,"");
  next();
});
app.set('view engine', '.hbs');

// session config
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "pavilion_ellehacks2020", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
 });

 function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Default initialize 
dser.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
  app.listen(HTTP_PORT, function(){
      console.log("Express http server listening on: " + HTTP_PORT)
  });
}).catch(function(err){
  console.log("unable to start server: " + err);
});


// GET home url path
app.get("/", function(req,res){
    res.render('home');
    
});

// GET about url path
app.get("/about", function(req,res){
  res.render('about');
});

// =================================PAVILION=================================================== //
app.get("/activities",ensureLogin,function(req,res){
  dser.getAllActivities()
      .then((data)=>{if(data.length >0)
                    {res.render("activities",{activities: data});}
                    else{res.render("activities",{message:"no results"})}})
      .catch((err)=>{res.render("activities",{message:"no results"})});
});
// ============================================================================================ //

// GET login page
app.get("/login", function(req,res){
  res.render("login");
});

// GET register page
app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  dataServiceAuth.registerUser(req.body).then(()=>{res.render("register",{successMessage: "User created"});}).catch((err)=>{res.render("register",{errorMessage: err, userName: req.body.userName});});
});

app.post("/login",function(req,res){
  req.body.userAgent = req.get('User-Agent');

  dataServiceAuth.checkUser(req.body).then((user) => {
    
    req.session.user = {
      userId: user.userId,// authenticated user's userName
      email: user.email,// authenticated user's email
      loginHistory: user.loginHistory// authenticated user's loginHistory
      }
    res.redirect('/');
   }).catch((err)=>{res.render('login', {errorMessage: err, userName: req.body.userName});});
   
});

// GET logout page
app.get("/logout",function(req,res){
  req.session.reset();
  res.redirect("/login");
});

// GET user history page
app.get("/userHistory", ensureLogin, function(req,res){
  res.render("userHistory");
});

// GET error page
app.use(function(req, res) {
  res.status(404).render('error');
});
