exports.getMyFriendsBirthDayWishes = function(req, res){
	console.log("friends percentage ", req.params.friendsMatch);
	var percentageMatch = req.params.friendsMatch;
	birhdayWishesSchema.find({})
}