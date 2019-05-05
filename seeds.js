const mongoose = require ('mongoose'),
        Island = require('./models/island'),
        Comment = require("./models/comments");
        
var data = [
    {   name: "Rottsnest Island",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwzShcRmpPPSZDhzc65dHpSsHyMR5GmwVK3WPJXx5CJpmBkWey",
        description: "Rottnest Island sits just offshore from the city of Perth, in Western Australia. A protected nature reserve, it's home to the quokka, a small wallaby-like marsupial. White-sand beaches and secluded coves include the Basin, with its shallow waters, and Thomson Bay, the main hub and ferry port. Strickland Bay is known for its surf breaks, while reef breaks occur at Radar Reef, off the island's far western tip.",
    },
    {   name: "Oahu",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcJhsD7lpMo2CIWL5SN6DNNaVrnW7V4s5ybJrl6gAvYuCAr3mt",
        description: "Oahu is a U.S. island in the Central Pacific, part of the Hawaiian island chain and home to the state capital, Honolulu. Highlights of the city include historic Chinatown and the Punchbowl, a crater-turned-cemetery. Waikiki is an iconic beach, dining and nightlife area. West of Honolulu is Pearl Harbor, site of the WWII's 1941 bombing attack and home to the USS Arizona Memorial.",
    },
    {   name: "Kauai",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNLPIgLvw5z-dU3duDlNif2hBNAdw52n-jN7NF7id56diFcNkW",
        description: "Kauai is an island in the Central Pacific, part of the Hawaiian archipelago. It's nicknamed the Garden Isle thanks to the tropical rainforest covering much of its surface. The dramatic cliffs and pinnacles of its Na Pali Coast have served as a backdrop for major Hollywood films, while 10-mile-long Waimea Canyon and the Nounou Trails traversing the Sleeping Giant mountain ridge are hiking destinations.",
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