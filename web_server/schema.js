var mongoose = require('mongoose');

var schema= mongoose.Schema;

var birthday_schema = new schema({
	name: {type: String, index: 1, unique: true,required: true},
	age : Number,
	status : String,
	groups: [String] 
},{collection: 'greetings'});

exports.birthday_schema= birthday_schema