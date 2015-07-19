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

exports.updateReminderFlag = function(req, res){
	console.log(req.body.friendName, req.body.userEmail)
	var friendName = req.body.friendName;
	var indexMatch;
	console.log("indexMatch", indexMatch)
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
			console.log(docs)
		console.log(docs.friendsMatch)
		docs.friendsMatch.forEach(function(friend, index){
			console.log("&&&&&&&& in forEach ", friend)
			if(friend.friendName === friendName){
				console.log("found match ", friend.friendName, friend)
				// friend.BirthdayReminderFlag = true;
				indexMatch = index;
				console.log("indexMatch", indexMatch)
				return;
			}
		})
		if(indexMatch >= 0){
			console.log("found match!!!");
			console.log("flag before", docs.friendsMatch[indexMatch].BirthdayReminderFlag)
			docs.friendsMatch[indexMatch].BirthdayReminderFlag = true;
			console.log("flag after", docs.friendsMatch[indexMatch].BirthdayReminderFlag)
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

exports.getSharedPictures = function(req, res){
	console.log("user email ", req.body.user, " user friend ", req.body.friendName);
	var SharedImages = [];
	var friendName = req.body.friendName;
	usersSchema.findOne({userEmail : req.body.user}).exec(function(err, docs){
		if(err)
			return console.error(err);
		docs.imagesWithFriends.forEach(function(image){
			console.log("in image ", image)
			if((_.contains(image.friendTags, friendName)) === true){
				console.log("image contains ", image.imagePath, " ", friendName);
				SharedImages.push(image.imagePath);
			}
		});
		if(SharedImages){
			console.log("returning array");
			res.status(200);
			res.json(SharedImages);
		}
	});
}

exports.addToArchive = function(req, res){
	console.log("adding to ignore list")
	var friendName = req.body.friendName;
	console.log("user email ", req.body.userEmail, " user friend ", req.body.friendName);
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
		console.log(docs)
		console.log(docs.friendsMatch)
		docs.friendsMatch.forEach(function(friend, index){
			console.log("&&&&&&&& in forEach ", friend)
			if(friend.friendName === friendName){
				console.log("found match ", friend.friendName, friend)
				// friend.BirthdayReminderFlag = true;
				indexMatch = index;
				console.log("indexMatch", indexMatch)
				return;
			}
		})
		if(indexMatch >= 0){
			console.log("found match!!!");
			console.log("flag before", docs.friendsMatch[indexMatch].friendInArchive)
			docs.friendsMatch[indexMatch].friendInArchive = true;
			console.log("flag after", docs.friendsMatch[indexMatch].friendInArchive)
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

exports.restoreFromArchive = function(req, res){
	console.log("restore from ignore list")
	var friendName = req.body.friendName;
	console.log("user email ", req.body.userEmail, " user friend ", req.body.friendName);
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
		console.log(docs)
		console.log(docs.friendsMatch)
		docs.friendsMatch.forEach(function(friend, index){
			console.log("&&&&&&&& in forEach ", friend)
			if(friend.friendName === friendName){
				console.log("found match ", friend.friendName, friend)
				// friend.BirthdayReminderFlag = true;
				indexMatch = index;
				console.log("indexMatch", indexMatch)
				return;
			}
		})
		if(indexMatch >= 0){
			console.log("found match!!!");
			console.log("flag before", docs.friendsMatch[indexMatch].friendInArchive)
			docs.friendsMatch[indexMatch].friendInArchive = false;
			console.log("flag after", docs.friendsMatch[indexMatch].friendInArchive)
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

exports.deleteFriend = function(req, res){
	console.log("deleting from ignore list")
	var friendName = req.body.friendName;
	console.log("user email ", req.body.userEmail, " user friend ", req.body.friendName);
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
		console.log(docs)
		console.log(docs.friendsMatch)
		docs.friendsMatch.forEach(function(friend, index){
			console.log("&&&&&&&& in forEach ", friend)
			if(friend.friendName === friendName){
				console.log("found match ", friend.friendName, friend)
				// friend.BirthdayReminderFlag = true;
				indexMatch = index;
				console.log("indexMatch", indexMatch)
				return;
			}
		})
		if(indexMatch >= 0){
			console.log("found match!!!");
			console.log("flag before", docs.friendsMatch[indexMatch].deletedFriendFlag)
			docs.friendsMatch[indexMatch].deletedFriendFlag = true;
			console.log("flag after", docs.friendsMatch[indexMatch].deletedFriendFlag)
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

