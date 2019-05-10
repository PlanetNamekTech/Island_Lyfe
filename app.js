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
    next();
});

app.use(authRoutes);
app.use("/islands",islandRoutes);
app.use("/islands/:id/comments",commentRoutes);

        // {name: "Oahu", image: "https://cdn.pixabay.com/photo/2016/11/14/22/18/beach-1824855__480.jpg"},
        // {name: "Maui", image: "https://cdn.pixabay.com/photo/2013/03/08/23/04/black-sand-91666__480.jpg"},
        // {name: "Maldives", image: "https://animewallpaper.live/wp-content/uploads/data/2017/12/9/Dani-Daniels-Pictures-WDSC00310199.jpg"},



app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("The IslandLyfe server has started");
});
