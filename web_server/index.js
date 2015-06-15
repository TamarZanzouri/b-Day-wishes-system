var mongoose = require('mongoose');
mongoose.connect('mongodb://db_usr:db_pass@ds031882.mongolab.com:31882/db_ringapp');

var user_schema = require('./schema').user_schema;
mongoose.model('usersM', user_schema);

// var conn = mongoose.connection;

// conn.on('error', function(err){
// 	console.log('connection error' + err);
// });

// conn.once('open', function(){
// 	console.log('connected');
// 	mongoose.disconnect();
// })


mongoose.connection.once('open', function(){
	var Users = this.model('usersM');
	console.log('connected');
	mongoose.disconnect();
})