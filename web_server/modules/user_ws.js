exports.create_user = function(req, res){
	console.log("in create user ", req.params.user);
	var user = req.params.user;
	usersSchema.findOneAndUpdate({ email : user }, {email : user} ,{ upsert : true }, function(err, docs){
		if(err){
			return console.error(err);
		}
		if(docs){
			res.status(200);
			res.json(docs);
		}
	});
}