var express = require('express'),
    router = express.Router({mergeParams: true}),
    Island = require("../models/island"),
    Comment = require("../models/comments");
    
// Comments New
router.get("/new", isLoggedIn, (req,res)=>{
    // Find island by ID
    Island.findById(req.params.id, (err, island)=>{
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {island: island});
        }
    });
});

// Comments Create
router.post("/", (req,res)=>{
    //Lookup island using ID
    Island.findById(req.params.id, isLoggedIn, (err,island)=>{
        if (err){
            console.log(err);
        } else {
                //create new comment
            Comment.create(req.body.comment, (err, comment)=>{
                if (err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id =req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    //connect new comment to island
                    island.comments.push(comment);
                    island.save();
                    //redirect to island show page
                    res.redirect("/islands/" + island._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;