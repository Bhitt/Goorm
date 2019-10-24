var mongoose = require("mongoose");

var DogSchema = new mongoose.Schema({
    name: String,
	breed: String,
	image: String
});

module.exports = mongoose.model("Dog", DogSchema);