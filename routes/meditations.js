var express = require("express");
var router = express.Router({mergeParams: true});
var Meditation = require("../models/meditation");
var middleware = require("../middleware/index");

router.get("/", function(req,res){
    Meditation.find({}, function(err, allMeditations){
        if(err){
            console.log(err);
        } else {
            res.render("meditations/index", {meditations: allMeditations, currentUser: req.user});
        }
    });
});

//CREATE - ADD NEW MEDITATION TO DB
router.post("/", middleware.isLoggedIn, function(req,res){
    //console.log(req);
    console.log(req.body);
    var name = req.body.name;
    var desc = req.body.description;
    var time = req.body.time;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newMeditation = {name: name, description: desc, time: time, author: author}
    console.log(newMeditation);

    //create a new meditation and save to DB
    Meditation.create(newMeditation, function(err, newlyCreated){
        
        if(err){
            return res.redirect("back", {'error': err.message});
        } else {
            //redirect back to meditation page
            res.redirect("/meditations/"+ newlyCreated.id);
        }
    });
});

//NEW allows us to input information into form to add workout into database
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("meditations/new");
});

//DAREN's CODE BELONGS HERE??
//SHOW - SHOWS US INFO ABOUT ONE MEDITATION
router.get("/:id", function(req,res){
    
    Meditation.findById(req.params.id).exec(function(err, foundMeditation){
        if(err || !foundMeditation){
            console.log(err);
            req.flash('error', 'Sorry, that meditation does not exist!');
            res.redirect('back');
        } else {
            console.log(foundMeditation);
            //render show template with the meditation
            res.render("meditations/show", {meditation: foundMeditation});
        }
    });
});

//Edit Meditation
router.get("/:id/edit", middleware.checkMeditationOwnership, function(req,res){
    Meditation.findById(req.params.id, function(err, foundMeditation){
        if(err || !foundMeditation){
            req.flash("error", "Could not find meditation!");
            res.redirect("back");
        } else {
            res.render("meditations/edit", {meditation: foundMeditation});
        }
    });
});

//Update Meditation Route
router.put("/:id", middleware.checkMeditationOwnership, function(req,res){
    Meditation.findByIdAndUpdate(req.params.id, req.body.meditation, function(err, updatedMedtation){
        if(err){
            res.redirect('/meditations');
        } else {
            req.flash('success', "Successfully Updated!");
            res.redirect("/meditations/" + req.params.id);
        }
    });
});

//Destroy Meditation Route
router.delete("/:id", middleware.checkMeditationOwnership, function(req,res){
    Meditation.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/meditations");
        } else {
            req.flash("success", "Meditation successfully deleted!");
            res.redirect("/meditations");
        }
    });
});


module.exports = router;