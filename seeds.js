const mongoose = require ('mongoose'),
        Island = require('./models/island'),
        Comment = require("./models/comments");
        
var data = [
    {   name: "Rottsnest Island",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwzShcRmpPPSZDhzc65dHpSsHyMR5GmwVK3WPJXx5CJpmBkWey",
        description: "Blah yea blah",
    },
    {   name: "Oahu",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcJhsD7lpMo2CIWL5SN6DNNaVrnW7V4s5ybJrl6gAvYuCAr3mt",
        description: "The coolest island",
    },
    {   name: "Kauia",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNLPIgLvw5z-dU3duDlNif2hBNAdw52n-jN7NF7id56diFcNkW",
        description: "Blah yea blah",
    }
    
];
 
function seedDB()  {
    //Remove all islands
    Island.remove({}, (err)=>{
    if(err){
         console.log(err);
    } else
        console.log("removed islands");
        // Add some islands
    data.forEach((seed)=>{
        Island.create(seed, (err,island)=>{
            if(err){
                console.log(err);
            } else {
                console.log("added island");
                // create a comment
                Comment.create(
                    {   
                        text: "This place is sexy",
                        author: "Homer"
                    }, (err,comment)=>{
                        if(err){
                            console.log(err);
                        } else {
                            island.comments.push(comment);
                            island.save();
                            console.log("Created new comment");
                        }
                        island.comments.push(comment);
                        island.save();
                    });
            }
        });
    });
});

}

module.exports = seedDB;
