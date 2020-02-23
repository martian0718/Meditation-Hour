var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//route to home page
router.get("/", function(req,res){
    res.render("landing");
});

//Authentication Routes

//showing the register form
router.get("/register", function(req,res){
    res.render("register");
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req,res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            return res.render("register", {"error": err.message});
        } else {
            passport.authenticate("local")(req,res,function(){
                req.flash("success", "Welcome to the meditation life " + user.username);
                res.redirect('/');
            });
        }
    });
});

//SHOW LOGIN FORM 
router.get('/login', function(req,res){
    res.render("login");
});

//HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }
), function(req,res){
//not necessary
});

//LOGOUT ROUTE
router.get('/logout', function(req,res){
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/");
});

module.exports = router;