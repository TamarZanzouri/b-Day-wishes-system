var mongoose = require('mongoose');

var schema= mongoose.Schema;

var users_schema = new schema({
	userEmail :  {type : String, index: true,unique: true, required: true},
	userName : {type : String, default : ''},
	profileImage : { type : String, default : ''},
	birthDate : { type : String, default : ''},
	imagesWithFriends :[{
		imagePath : { type : String, default : ''},
		friendTags : { type : Array, default : []}
	}],
	friendsMatch : [{
		friendName : {type : String, default : ''},
		friendProfileImage : {type : String, default : ''},
		friendshipPercent : Number,
		birthDate : { type : String, default : ''}
	}]
},{collection: 'users'});

exports.users_schema= users_schema;