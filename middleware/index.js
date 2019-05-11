// ALL MIDDLEWARE
var Island = require("../models/island"),
    Comment = require("../models/comments");

const middlewareObj = {};

middlewareObj.checkIslandOwenership = function(req,res,next){
    if(req.isAuthenticated()){
        // does user own island?
        Island.findById(req.params.id, (err, foundIsland)=>{
            if (err){
                res.redirect("back");
            } else {
                // does user own island?
                if(foundIsland.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
         });
    } else {
        res.redirect("back");
    }};

middlewareObj.checkCommentOwenership = function(req,res,next){
    if(req.isAuthenticated()){
        // does user own comment?
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if (err){
                res.redirect("back");
            } else {
                // does user own island?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
         });
    } else {
        res.redirect("back");
    }};
    
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;