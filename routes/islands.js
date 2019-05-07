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
router.post("/", (req,res) =>{
    // get data from form and add to islands array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newIsland = {name: name, image: image, description: desc};
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
router.get("/new", (req,res) => {
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

module.exports = router;