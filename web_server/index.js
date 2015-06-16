var mongoose = require('mongoose');
var express = require('express');
mongoose.connect('mongodb://db_usr:db_pass@ds031972.mongolab.com:31972/grades');
var app = express();

var birthday_schema = require('./schema').birthday_schema;
mongoose.model('birthdayM', birthday_schema);

// var conn = mongoose.connection;

// conn.on('error', function(err){
// 	console.log('connection error' + err);
// });

// conn.once('open', function(){
// 	console.log('connected');
// 	mongoose.disconnect();
// })


mongoose.connection.once('open', function(){
	var birhdayWishes = this.model('birthdayM');
	console.log('connected');
	// mongoose.disconnect();

	app.use('/',function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
		next();
	});
	app.get('/', function(req, res){


		birhdayWishes.find({}, function(err, docs){
		if(err){
			console.error(err);
			res.status(404);

		}
		else{
			res.status(200);
			res.json(docs);
		}

		});
	});
});



var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("listenting to port " + port);
});