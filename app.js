const express       = require('express'), 
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      Island        = require("./models/island"),
      Comment       = require("./models/comments"),
      seedDB        = require("./seeds");
      
seedDB();
mongoose.connect("mongodb://localhost:27017/island_lyfe", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

    


        // {name: "Oahu", image: "https://cdn.pixabay.com/photo/2016/11/14/22/18/beach-1824855__480.jpg"},
        // {name: "Maui", image: "https://cdn.pixabay.com/photo/2013/03/08/23/04/black-sand-91666__480.jpg"},
        // {name: "Maldives", image: "https://animewallpaper.live/wp-content/uploads/data/2017/12/9/Dani-Daniels-Pictures-WDSC00310199.jpg"},

app.get("/", (req,res) => {
    res.render("landing");
});


//INDEX - Show all islands
app.get("/islands", (req,res)=>{
    // Get all islands from DB
    Island.find({}, (err,allIslands)=>{
        if(err){
            console.log(err);
        } else {
            res.render("islands/index",{islands: allIslands});
        }
    });
});

//CREATE - Add new island to DB
app.post("/islands", (req,res) =>{
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
app.get("/islands/new", (req,res) => {
   res.render("islands/new") ;
});


//SHOW - Shows more info about one island
app.get("/islands/:id", (req,res)=>{
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

// ====================
// COMMENTS ROUTES
// ====================
app.get("/islands/:id/comments/new", (req,res)=>{
    // Find island by ID
    Island.findById(req.params.id, (err, island)=>{
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {island: island});
        }
    });
});

app.post("/islands/:id/comments", (req,res)=>{
    //Lookup island using ID
    Island.findById(req.params.id, (err,island)=>{
        if (err){
            console.log(err);
        } else {
                //create new comment
            Comment.create(req.body.comment, (err, comment)=>{
                if (err){
                    console.log(err)
                } else {
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


app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("The IslandLyfe server has started");
});