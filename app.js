const express       = require('express'), 
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      Island        = require("./models/island");

mongoose.connect("mongodb://localhost:27017/island_lyfe", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// Island.create({
//   name: "Maui",
//   image: "https://cdn.pixabay.com/photo/2013/03/08/23/04/black-sand-91666__480.jpg",
//   description: "This is an awesome island with plenty of babes in bikinis"
// }, (err,island)=>{
//     if(err){
//         console.log("error");
//     } else {
//         console.log("newly created island:")
//         console.log(island);
        
//     }
// });
    


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
            res.render("index",{islands: allIslands});
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
   res.render("new.ejs") ;
});

//SHOW - Shows more info about one island
app.get("/islands/:id", (req,res)=>{
    //Find the island with provided ID
    Island.findById(req.params.id,(err, foundIsland)=>{
        if(err){
            console.log(err);
        } else {
               //Render show template with that island
               res.render("show",{island: foundIsland});
        }
    });
});
app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("The IslandLyfe server has started");
});