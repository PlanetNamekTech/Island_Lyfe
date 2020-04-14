var express = require('express'),
    router = express.Router(),
    Island = require("../models/island"),
    middleware = require("../middleware");
    
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

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

// //CREATE - Add new island to DB
// router.post("/", middleware.isLoggedIn,  (req,res) =>{
//     // get data from form and add to islands array
//     var name = req.body.name;
//     var price = req.body.price;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     };
//     var newIsland = {name: name, price: price, image: image, description: desc, author: author};
//     // Create a new island and save to DB
//     Island.create(newIsland, (err, newlyCreated)=>{
//         if(err){
//             alert(err);
//         } else {
//                 //redirect back to islands page
//                 res.redirect("/islands");
//         }
//     });

// });

//CREATE - add new island to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to islands array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newIsland = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new island and save to DB
    Island.create(newIsland, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to islands page
            console.log(newlyCreated);
            res.redirect("/islands");
        }
    });
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
// router.put("/:id/", middleware.checkIslandOwenership, (req,res)=>{
//     // find and update correct island
//     Island.findByIdAndUpdate(req.params.id, req.body.island, function(err, updatedIsland){
//         if(err){
//             res.redirect("/islands");
//         } else {
//             res.redirect("/islands/" + req.params.id);
//         }
//     });
// });

//UPDATE ISLAND ROUTE
 router.put("/:id", middleware.checkIslandOwnership, (req, res)=>{
  geocoder.geocode(req.body.location, function (err, data) {
     if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
     } 
     req.body.island.lat = data[0].latitude;
     req.body.island.lng = data[0].longitude;
     req.body.island.location = data[0].formattedAddress;

     Island.findByIdAndUpdate(req.params.id, req.body.island, function(err, island){
         if(err){
             req.flash("error", err.message);
             res.redirect("back");
         } else {
             req.flash("success","Successfully Updated!");
             res.redirect("/islands/" + island._id);
         }
     });
  });
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