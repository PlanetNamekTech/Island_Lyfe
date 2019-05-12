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
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req,res, function(){
           req.flash("success", "Welcome to IslandLyfe " + user.username);
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
    req.flash("success", "Logged out successfully");
    res.redirect("/islands");
});

module.exports = router; 
