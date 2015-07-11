var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser')
var userWS = require('./modules/user_ws');
var birthdayWishesWS = require('./modules/birthdayWishes_ws')
var mongopath = 'mongodb://db_usr:db_pass@ds031972.mongolab.com:31972/grades';
var app = express();

var birthday_schema = require('./models/birthdayWishesSchema').birthday_schema;
var users_schema = require('./models/usersSchema').users_schema;

birhdayWishesSchema = mongoose.model('birthdayM', birthday_schema);
usersSchema = mongoose.model('usersM', users_schema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var options = {
	db: { native_parser : true }
}

mongoose.connect(mongopath,options);

db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', function () {
	console.log("connected through mongoose");
});

db.on('disconnected', function()
{
	console.log("you are disconnected, reconnecting");
	mongoose.connect(mongopath,options);
});


app.use('/',function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	next();
});

app.get('/', function(req, res){

	birhdayWishesSchema.find({}, function(err, docs){
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

app.post('/create_user', userWS.create_user);

// app.param('friendsMatch', function(req, res, next, value){
// 	console.log("recieved user ", value);
// 	next();
// });

app.post('/getMyFriendsBirthDayWishes', birthdayWishesWS.getMyFriendsBirthDayWishes)

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("listenting to port " + port);
});