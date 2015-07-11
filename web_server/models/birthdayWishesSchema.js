var mongoose = require('mongoose');

var schema= mongoose.Schema;

var birthday_schema = new schema({
	greetingsValue :  String, default : '',
	category : { type : Number , index : true}
},{collection: 'greetings'});

exports.birthday_schema= birthday_schema