require('dotenv').config();

const express       = require('express'), 
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      Island        = require("./models/island"),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      User          = require("./models/user"),
      Comment       = require("./models/comments"),
      seedDB        = require("./seeds"),
      flash         = require("connect-flash"),
      methodOverride = require('method-override');

// Requiring Routes
var commentRoutes = require('./routes/comments'),
    islandRoutes = require("./routes/islands"),
    authRoutes  = require("./routes/index");
      
// Seed the database      
// seedDB();
mongoose.connect("mongodb://localhost:27017/island_lyfe", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love tacos",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/islands",islandRoutes);
app.use("/islands/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("The IslandLyfe server has started");
});
