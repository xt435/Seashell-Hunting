var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    HuntingGround = require("./models/huntingGround"),
    Comment     = require("./models/comment"),
    User = require("./models/user"),
    seedDB  = require("./seeds")

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/seashell_hunting");
// mongoose.connect("mongodb://localhost/seashell_hunting");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

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

//INDEX - show all hunting grounds
app.get("/hunting_grounds", function(req, res) {
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

//NEW - show form to create new hunting ground
app.get("/hunting_grounds/new", function(req, res){
    res.render("huntingGrounds/new");
});

// SHOW - shows more info about one hunting ground
app.get("/hunting_grounds/:id", function(req, res){
    // find the hunting ground with provided ID
     HuntingGround.findById(req.params.id).populate("comments").exec(function(err, foundHuntingGround){
         if(err) {
             console.log(err);
         } else {
             res.render("huntingGrounds/show", {foundHuntingGround:foundHuntingGround});
         }
     });
})

// ====================
// COMMENTS ROUTES
// ====================

app.get("/hunting_grounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    HuntingGround.findById(req.params.id, function(err, huntingGround){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {huntingGround: huntingGround});
        }
    })
});

app.post("/hunting_grounds/:id/comments", isLoggedIn, function(req, res){
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

// ========================
// Auth Routes
// ========================

// show register form
app.get("/register", function(req, res){
    res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/hunting_grounds");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/hunting_grounds",
        failureRedirect: "/login" 
    }), function(req, res){
    
});

// logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/hunting_grounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Seashell Hunting server has been started!")
});