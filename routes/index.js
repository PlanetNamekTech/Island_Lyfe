var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require("../models/user");
    
// Root Route
router.get("/", (req,res) => {
    res.render("landing");
});

// ==============
// AUTH ROUTES
// ==============
router.get("/register",(req,res)=>{
    res.render("register");
});

// handle sign up logic
router.post("/register",(req,res)=>{
    var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, (err, user)=>{
       if(err) {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res, function(){
           res.redirect("/islands");
       });
   });
});

// show login form
router.get("/login", (req,res)=>{
    res.render("login");
});
// handling login logic
router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/islands", 
        failureRedirect: "/login"
    }),
        (req,res)=>{
});

// add logout route
router.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/islands");
});

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router; 
