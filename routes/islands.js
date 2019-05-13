var express = require('express'),
    router = express.Router(),
    Island = require("../models/island"),
    middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn,  (req,res) =>{
    // get data from form and add to islands array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newIsland = {name: name, price: price, image: image, description: desc, author: author};
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
router.get("/new", middleware.isLoggedIn, (req,res) => {
   res.render("islands/new") ;
});


//SHOW - Shows more info about one island
router.get("/:id", (req,res)=>{
    //Find the island with provided ID
    Island.findById(req.params.id).populate("comments").exec((err, foundIsland)=>{
        if(err || !foundIsland){
            req.flash('error', "Island not found");
            res.redirect("back");
        } else {
                console.log(foundIsland);
               //Render show template with that island
               res.render("islands/show",{island: foundIsland});
        }
    });
});

// EDIT ISLAND ROUTE
router.get("/:id/edit", middleware.checkIslandOwenership, (req,res)=>{
        // does user own island
     Island.findById(req.params.id, (err, foundIsland)=>{
         res.render("islands/edit", {island: foundIsland});
    });
 });

// UPDATE ISLAND ROUTE 
router.put("/:id/", middleware.checkIslandOwenership, (req,res)=>{
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
router.delete("/:id", middleware.checkIslandOwenership, (req,res)=>{
    Island.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/islands");
        } else {
            res.redirect("/islands");
        }
    });
});

module.exports = router;