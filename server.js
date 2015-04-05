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

//set the view engine to ejs
app.set('view engine', 'ejs');

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
	res.render('index');
});

router.get('/list',function(req,res) {
	//creating route for /
	res.render('list');
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


////////////// READING ALL FOOD //////////////////

// Create endpoint /food for GET
foodRoute.get(function(req, res) {
  // Use the food model to find all foods
  Food.find(function(err, foods) {
    if (err)
      res.send(err);

  	//sent the foods object to list page
    res.render('list', {foods: foods});
  });
});


///////////// READING SINGLE FOOD WITH GET ////////////////

//Enter in the food name in the URL
//Create a new route with the /food/:food_id prefix
var singleFoodRoute = router.route('/food/:food_name');

//Create endpoint /food/:food_id for GET
singleFoodRoute.get(function(req,res) {
	//use the food model to find a specific food
	//req.params retrieves the parameter in URL
	Food.find({ name: req.params.food_name }, function(err, food) {
		if(err)
			res.send(err)

		res.json(food);
	});
});

////// READING SINGLE FOOD WITH POST ////////////////

//Utilizes the search bar
var foodSearchRoute = router.route('/search');

foodSearchRoute.post(function(req,res) {

	Food.find({ name: req.body.name }, function(err, food) {
		if(err)
			res.send(err)

		res.json(food);
	});

});

////////// REMOVING FOOD WITH DELETE ///////////////

var foodDeleteRoute = router.route('/delete');

foodDeleteRoute.post(function(req, res) {

	Food.remove({ name: req.body.name }, function(err, food) {
		if(err)
			res.send(err);

		res.json(food);
	});
});

//////////////// DELETE ALL ///////////////////////////

var deleteAllRoute = router.route('/deleteAll');

deleteAllRoute.post(function(req, res) {

	Food.remove({}, function(err) {
		if(err)
			res.send(err)

		res.json({message: 'All food has been deleted'});
	});
});


//register all routes, can instead use app.get('/whatever', function(req, res) {});
app.use(router);

//start the server
app.listen(port);
console.log('Connecting to port ' + port);