var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    HuntingGround = require("./models/huntingGround"),
    seedDB  = require("./seeds")
    
mongoose.connect("mongodb://localhost/seashell_hunting");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

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
            res.render("index", {huntingGrounds:allHuntingGrounds});
        }
    })
});

app.post("/hunting_grounds", function(req, res) {
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

app.get("/hunting_grounds/new", function(req, res){
    res.render("new.ejs");
});

app.get("/hunting_grounds/:id", function(req, res){
    // find the hunting ground with provided ID
     HuntingGround.findById(req.params.id).populate("comments").exec(function(err, foundHuntingGround){
         if(err) {
             console.log(err);
         } else {
             res.render("show", {huntingGround:foundHuntingGround});
         }
     });
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Seashell Hunting server has been started!")
});