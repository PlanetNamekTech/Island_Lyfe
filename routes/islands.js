var express = require('express'),
    router = express.Router(),
    Island = require("../models/island");

//INDEX - Show all islands
router.get("/", (req,res)=>{
    // Get all islands from DB
    Island.find({}, (err,allIslands)=>{
        if(err){
            console.log(err);
        } else {
            res.render("islands/index",{islands: allIslands, currentUser: req.user});
        }
    });
});

//CREATE - Add new island to DB
router.post("/", isLoggedIn,  (req,res) =>{
    // get data from form and add to islands array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newIsland = {name: name, image: image, description: desc, author: author};
    // Create a new island and save to DB
    Island.create(newIsland, (err, newlyCreated)=>{
        if(err){
            alert(err);
        } else {
                //redirect back to islands page
                res.redirect("/islands");
        }
    });

});

//NEW - Show form to create new island
router.get("/new", isLoggedIn, (req,res) => {
   res.render("islands/new") ;
});


//SHOW - Shows more info about one island
router.get("/:id", (req,res)=>{
    //Find the island with provided ID
    Island.findById(req.params.id).populate("comments").exec((err, foundIsland)=>{
        if(err){
            console.log(err);
        } else {
                console.log(foundIsland);
               //Render show template with that island
               res.render("islands/show",{island: foundIsland});
        }
    });
});

// EDIT ISLAND ROUTE
router.get("/:id/edit", checkIslandOwenership, (req,res)=>{
        // does user own island
     Island.findById(req.params.id, (err, foundIsland)=>{
         res.render("islands/edit", {island: foundIsland});
    });
 });

// UPDATE ISLAND ROUTE 
router.put("/:id/", checkIslandOwenership, (req,res)=>{
    // find and update correct island
    Island.findByIdAndUpdate(req.params.id, req.body.island, function(err, updatedIsland){
        if(err){
            res.redirect("/islands");
        } else {
            res.redirect("/islands/" + req.params.id);
        }
    });
    // redirect to show page
});

// DESTROY ISLAND ROUTE
router.delete("/:id", checkIslandOwenership, (req,res)=>{
    Island.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/islands");
        } else {
            res.redirect("/islands");
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

function checkIslandOwenership(req,res,next){
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
    }}
module.exports = router;