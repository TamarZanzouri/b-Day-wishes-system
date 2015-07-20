//get birthday wishes accoring to friend category
exports.getMyFriendsBirthDayWishes = function(req, res){
	// user is the user that made the login and friend is the friend choosen to make a happy birthday wish
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