var express = require('express'),
    router = express.Router({mergeParams: true}),
    Island = require("../models/island"),
    Comment = require("../models/comments"),
    middleware = require("../middleware");
    
// Comments New
router.get("/new", middleware.isLoggedIn, (req,res)=>{
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
router.post("/", middleware.isLoggedIn, (req,res)=>{
    //Lookup island using ID
    Island.findById(req.params.id, (err,island)=>{
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

// Edit
router.get("/:comment_id/edit", middleware.checkCommentOwenership,  (req,res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {island_id: req.params.id, comment: foundComment}); 
        }
    });
});

// Comment Update
router.put("/:comment_id", (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/islands/" + req.params.id);
        }
    });
});

// Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwenership, (req,res)=>{
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/islands/" + req.params.id);
        }
    });
});

module.exports = router;