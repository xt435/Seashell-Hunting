var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var huntingGrounds = [
    {name: "Calvert Cliffs State Park, Maryland", image: "http://travel.home.sndimg.com/content/dam/images/travel/fullrights/2016/08/5/0/CI_Calvert_Marine_Museum-Shark-Teeth-Calvert-Cliffs.jpg.rend.hgtvcom.616.462.suffix/1491593549499.jpeg"},
    {name: "Jeffreys Bay, South Africa", image: "http://travel.home.sndimg.com/content/dam/images/travel/fullrights/2016/08/5/0/CI_Calvert_County_Dept_Economic_Development-Sharks-Tooth-Calvert-Cliffs-Beach.jpg.rend.hgtvcom.616.462.suffix/1491593549472.jpeg"},
];

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/hunting_grounds", function(req, res) {
    res.render("hunting_grounds", {huntingGrounds:huntingGrounds});
});

app.post("/hunting_grounds", function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newHuntingGround = {name: name, image: image};
    huntingGrounds.push(newHuntingGround);
    // redirect back to campgrounds page
    res.redirect("/hunting_grounds");
});

app.get("/hunting_grounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Seashell Hunting server has been started!")
});