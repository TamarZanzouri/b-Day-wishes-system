var mongoose = require('mongoose');

var schema= mongoose.Schema;

var user_schema= new schema({
	name: {type: String, index: 1, unique: true,required: true},
	age : Number,
	status : String,
	groups: [String] 
},{collection: 'users'});

exports.user_schema= user_schema