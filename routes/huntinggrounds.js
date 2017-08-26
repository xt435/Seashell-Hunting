var express = require("express");
var router = express.Router({mergeParams: true});
var HuntingGround = require("../models/huntingGround");

// HuntingGround.create(
//     {
//         name: "Jeffreys Bay, South Africa",
//         image: "http://travel.home.sndimg.com/content/dam/images/travel/fullrights/2016/08/5/0/CI_Calvert_County_Dept_Economic_Development-Sharks-Tooth-Calvert-Cliffs-Beach.jpg.rend.hgtvcom.616.462.suffix/1491593549472.jpeg",  
//         description: "Jeffreys Bay (Afrikaans: Jeffreysbaai, also known as J-bay) is a town located in the Eastern Cape province of South Africa. The town is situated just off the N2 Highway, about 75 km southwest of Port Elizabeth."
//     }, function(err, huntingGround){
        
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATE HUNTINGGROUND: ");
//             console.log(huntingGround);
//         }
//     });

//INDEX - show all hunting grounds
router.get("/", function(req, res) {
    // res.render("hunting_grounds", {huntingGrounds:huntingGrounds});
    // Get all huntingGrounds from DB
    HuntingGround.find({}, function(err, allHuntingGrounds){
        if(err){
            console.log(err);
        } else {
            res.render("huntingGrounds/index", {huntingGrounds:allHuntingGrounds, currentUser: req.user});
        }
    })
});


//CREATE - add new hunting ground to DB
router.post("/", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newHuntingGround = {name: name, image: image, description: desc};
    HuntingGround.create(newHuntingGround, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/hunting_grounds");
        }
    })
});

//NEW - show form to create new hunting ground
router.get("/new", function(req, res){
    res.render("huntingGrounds/new");
});

// SHOW - shows more info about one hunting ground
router.get("/:id", function(req, res){
    // find the hunting ground with provided ID
     HuntingGround.findById(req.params.id).populate("comments").exec(function(err, foundHuntingGround){
         if(err) {
             console.log(err);
         } else {
             res.render("huntingGrounds/show", {foundHuntingGround:foundHuntingGround});
         }
     });
})

module.exports = router;