/************ REQUIRED PACKAGES ***************/

var express = require('express');
var mongoose = require('mongoose');
//to accept data via POST or PUT
var bodyParser = require('body-parser');
//to add paths of views to route
var path = require('path');

/*********************************************/

//load food model in server.js
var Food = require('./models/food');

//connect to caloriecounter MongoDB
mongoose.connect('mongodb://localhost:27017/caloriecounter');


//create our express application
var app = express();


//to use POST or PUT with body-parser package
app.use(bodyParser.urlencoded({
	extended:true
}));

//static middleware that serves the public folder
app.use(express.static('./public'));


//use environment defined port of 3002
var port = process.env.PORT || 3002;

//create our express router
var router = express.Router();


//initial route for testing
router.get('/',function(req,res) {
	//creating route for /
	res.sendFile(path.join(__dirname + '/views/index.html'));
});


/************************* CRUD FUNCTIONS *************************/


//////////////////////// ADDING FOOD ///////////////////////////////

//create new route with prefix food
var foodRoute = router.route('/food');
//create endpoint /food for POSTS
foodRoute.post(function(req,res) {
	//new instance of food model
	var food = new Food();

	//set the food qualities that came from the POST data
	food.name = req.body.name;
	food.calories = req.body.calories;
	food.protein = req.body.protein;
	food.fat = req.body.fat;
	food.carbs = req.body.carbs;

	//save food and check for errors
	food.save(function(err) {
		if(err)
			res.send(err);
		
		res.json({	message: 'Food added to the list',
					data: food
				});
	});
});


////////////// READING FOOD //////////////////

// Create endpoint /api/beers for GET
foodRoute.get(function(req, res) {
  // Use the food model to find all foods
  Food.find(function(err, foods) {
    if (err)
      res.send(err);

    res.json(foods);
  });
});












//register all routes
app.use(router);

//start the server
app.listen(port);
console.log('Connecting to port ' + port);