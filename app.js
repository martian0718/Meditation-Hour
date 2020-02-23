const express = require("express"),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      User = require('./models/user'),
      Meditation = require("./models/meditation");
      flash = require("connect-flash"),
      methodOverride = require('method-override');
//REQUIRING ROUTES
var userRoutes = require('./routes/users');
var indexRoutes = require("./routes/index");
var meditationRoutes = require("./routes/meditations");

mongoose.connect("mongodb://localhost:27017/meditation", {useNewUrlParser: true, useUnifiedTopology: true});

      
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //allows us to not have to write ejs after every ejs file
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//passport configuration
app.use(require('express-session')({
    secret: "meditation is good for your health",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//allows us to include currentUser on every template
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use("/meditations", meditationRoutes);


//always listen to local port 3000 for testing process.env.PORT
app.listen(3000, process.env.IP, function(){
    console.log("Meditation has started");
});


