const mongoose = require('mongoose');

var islandSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Island", islandSchema);