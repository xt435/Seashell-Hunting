var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    
mongoose.connect("mongodb://localhost/seashell_hunting");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//SCHEMA SETUP
var huntingGroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var HuntingGround = mongoose.model("HuntingGround", huntingGroundSchema);

// HuntingGround.create(
//     {
//         name: "Jeffreys Bay, South Africa",
//         image: "http://travel.home.sndimg.com/content/dam/images/travel/fullrights/2016/08/5/0/CI_Calvert_County_Dept_Economic_Development-Sharks-Tooth-Calvert-Cliffs-Beach.jpg.rend.hgtvcom.616.462.suffix/1491593549472.jpeg"  }, function(err, huntingGround){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATE HUNTINGGROUND: ");
//             console.log(huntingGround);
//         }
//     });

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/hunting_grounds", function(req, res) {
    // res.render("hunting_grounds", {huntingGrounds:huntingGrounds});
    // Get all huntingGrounds from DB
    HuntingGround.find({}, function(err, allHuntingGrounds){
        if(err){
            console.log(err);
        } else {
            res.render("hunting_grounds", {huntingGrounds:allHuntingGrounds});
        }
    })
});

app.post("/hunting_grounds", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newHuntingGround = {name: name, image: image};
    HuntingGround.create(newHuntingGround, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/hunting_grounds");
        }
    })
});

app.get("/hunting_grounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Seashell Hunting server has been started!")
});