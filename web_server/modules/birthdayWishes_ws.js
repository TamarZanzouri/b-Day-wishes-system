exports.getMyFriendsBirthDayWishes = function(req, res){
	console.log("user email ", req.body.user, " user friend ", req.body.friend)
	birhdayWishesSchema.find({ category : req.body.friend}, function(err, docs){
		if(err)
			return console.error(err);
		else
			console.log(docs)
			res.status(200);
			res.send(docs);
	})
}