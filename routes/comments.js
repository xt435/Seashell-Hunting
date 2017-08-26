var express = require("express");
var router  = express.Router({mergeParams: true});
var HuntingGround = require("../models/huntingGround");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    HuntingGround.findById(req.params.id, function(err, huntingGround){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {huntingGround: huntingGround});
        }
    })
});

//Comments Create
router.post("/", isLoggedIn, function(req, res){
  //lookup campground using ID
  HuntingGround.findById(req.params.id, function(err, huntingground){
      if(err){
          console.log(err);
          res.redirect("/hunting_grounds");
      } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err){
              console.log(err);
          } else {
              huntingground.comments.push(comment);
              huntingground.save();
              res.redirect('/hunting_grounds/' + huntingground._id);
          }
        });
      }
  });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;