var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Meditation = require("../models/meditation");
var middleware = require("../middleware/index");

//Users Profile
router.get("/:id", function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser)  {
            req.flash("error", "User couldn't be found"); 
            res.redirect("/")  
        } else {
            Meditation.find().where('author.id').equals(foundUser._id).exec(function(err,foundMeditations){
                if(err){
                    req.flash('error', 'Something went wrong!');
                     return res.redirect('/');
                } else {
                    res.render("users/show", {user: foundUser, meditations: foundMeditations});
                }
            });
            
        }
    });
});

//User Editing Profile
router.get("/:id/edit", middleware.checkUser, function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash('error', "Could not find user!");
            res.redirect('back');
        } else {
            res.render('users/edit', {user: foundUser});
        }
    });
});

//USER UPDATING PROFILE
router.put("/:id", middleware.checkUser, function(req,res){
    //find and update correct user
    //redirect somewhere else
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            return res.render("users/edit", {"error": err.message});
        } else {
            req.flash("success", "Successfully updated!");
            res.redirect("/users/"+req.params.id);
              
        }
    });
});


module.exports = router;