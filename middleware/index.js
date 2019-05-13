// ALL MIDDLEWARE
var Island = require("../models/island"),
    Comment = require("../models/comments");

const middlewareObj = {};

middlewareObj.checkIslandOwenership = function(req,res,next){
    if(req.isAuthenticated()){
        // does user own island?
        Island.findById(req.params.id, (err, foundIsland)=>{
            if (err || !foundIsland){
                req.flash("error", "Island not found");
                res.redirect("back");
            } else {
                // does user own island?
                if(foundIsland.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
         });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }};

middlewareObj.checkCommentOwenership = function(req,res,next){
    if(req.isAuthenticated()){
        // does user own comment?
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if (err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own island?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
         });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }};
    
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;