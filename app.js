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

// requiring routes
var commentRoutes = require("./routes/comments"),
    huntinggroundRoutes = require("./routes/huntinggrounds"),
    indexRoutes = require("./routes/index")

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

app.use("/", indexRoutes);
app.use("/hunting_grounds", huntinggroundRoutes);
app.use("/hunting_grounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Seashell Hunting server has been started!")
});