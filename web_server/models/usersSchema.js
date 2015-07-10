var mongoose = require('mongoose');

var schema= mongoose.Schema;

var users_schema = new schema({
	userEmail :  {type : String, index: true,unique: true, required: true},
	userName : {type : String, default : ''},
	profileImage : { type : String, default : ''},
	birthDate : Date,
	imagesWithFriends :[{
		imagePath : { type : String, default : ''},
		friendTags : { type : Array, default : []}
	}],
	friendsMatch : [{
		friendName : {type : String, default : ''},
		friendshipPercent : Number
	}]
},{collection: 'users'});

exports.users_schema= users_schema;