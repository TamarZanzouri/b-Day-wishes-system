exports.create_user = function(req, res){
	console.log("in create user ", req.body.user);
	var user = req.body.user;
	console.log("email ", user.userEmail)
	usersSchema.findOneAndUpdate({ email : user.userEmail }, {email : user.userEmail, profileImage : user.profileImage} ,{ upsert : true }, function(err, docs){
		if(err){
			return console.error(err);
		}
		if(docs){
			res.status(200);
			res.json(docs);
		}
	});
}