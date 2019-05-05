const mongoose = require('mongoose');

var islandSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

module.exports = mongoose.model("Island", islandSchema);