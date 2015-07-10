var mongoose = require('mongoose');

var schema= mongoose.Schema;

var birthday_schema = new schema({
	greetingsValue :  String, default : '',
	category : Number
},{collection: 'greetings'});

exports.birthday_schema= birthday_schema