//load packages
var mongoose = require('mongoose');

//define food schema
var FoodSchema = new mongoose.Schema({
	name: String,
	calories: Number,
	protein: Number,
	fat: Number,
	carbs: Number
});

//export the mongoose model
module.exports = mongoose.model('Food', FoodSchema);
