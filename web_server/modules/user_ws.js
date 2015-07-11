exports.create_user = function(req, res){
	console.log("in create user ", req.body.user);
	var user = req.body.user;
	console.log("email ", user.userEmail)
	usersSchema.findOne(
		{userEmail : user.userEmail },
		function(err, docs){
			if(err){
				return console.error(err);
			}
			if(docs){
				usersSchema.findOneAndUpdate({userEmail : user.userEmail}, 
					{userEmail : user.userEmail, profileImage : user.profileImage},
					{ upsert : true }, 
					function(err, docs){
						console.log("user ", user.userEmail, " updated");
						res.status(200);
						res.json(docs);
					});
					}
			else{
				console.log("adding new user");
				var newUser = new usersSchema(user);
				newUser.save(function(err, result){
					if(err)
						return console.error(err);
					else
						console.log("created new user")
				})
			}
	});
}