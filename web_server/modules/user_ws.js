//create user or update user via google+ sign in
exports.create_user = function(req, res){
	console.log("in create user ", req.body.user);
	//reciving the user email via google+
	var user = req.body.user;
	console.log("email ", user.userEmail)
	//find if user exists
	usersSchema.findOne(
		{userEmail : user.userEmail },
		function(err, docs){
			if(err){
				return console.error(err);
			}
			//if user exist update his profile
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
				//if user dosent exist create a new user with the defult user schema
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

//update reminder flag if user wants to be reminded a day before
exports.updateReminderFlag = function(req, res){
	console.log(req.body.friendName, req.body.userEmail)
	//get the friend name to get reminded
	var friendName = req.body.friendName;
	var indexMatch;
	console.log("indexMatch", indexMatch)
	//find user document and run through the array of friends to find the friend to be reminded of
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else{
			docs.friendsMatch.forEach(function(friend, index){
				if(friend.friendName === friendName){
					console.log("found match ", friend.friendName, friend)
					//get the index of the friend in the array
					indexMatch = index;
					console.log("indexMatch", indexMatch)
					return;
				}	
		});
		}
		//if friend found get the index in the array to update the flag
		if(indexMatch >= 0){
			//update flag to true and save to updated document
			docs.friendsMatch[indexMatch].BirthdayReminderFlag = true;
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

//get taged photos with friend for the gallery
exports.getSharedPictures = function(req, res){
	console.log("user email ", req.body.user, " user friend ", req.body.friendName);
	//array of photos taged together
	var SharedImages = [];
	//friend name for making birthday wish
	var friendName = req.body.friendName;
	//find user logged in and run through the array of photos to find match with friend
	usersSchema.findOne({userEmail : req.body.user}).exec(function(err, docs){
		if(err)
			return console.error(err);
		//get matched photos of user logged in and friend
		docs.imagesWithFriends.forEach(function(image){
			console.log("in image ", image)
			if((_.contains(image.friendTags, friendName)) === true){
				console.log("image contains ", image.imagePath, " ", friendName);
				SharedImages.push(image.imagePath);
			}
		});
		//if there are shared photos return array of photos
		if(SharedImages){
			console.log("returning array, " ,SharedImages);
			res.status(200);
			res.json(SharedImages);
		}
	});
}

//move friend to archive/ignore list
exports.addToArchive = function(req, res){
	console.log("adding to ignore list")
	//get friend to add to ignore list
	var friendName = req.body.friendName;
	console.log("user email ", req.body.userEmail, " user friend ", req.body.friendName);
	//find user logged in and run through array of friends
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
		console.log(docs)
		console.log(docs.friendsMatch)
		docs.friendsMatch.forEach(function(friend, index){
			if(friend.friendName === friendName){
				indexMatch = index;
				return;
			}
		})
		//if found match update flag of ignore friend
		if(indexMatch >= 0){
			docs.friendsMatch[indexMatch].friendInArchive = true;
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

//restore friend from archive to user list
exports.restoreFromArchive = function(req, res){
	console.log("restore from ignore list")
	//friend to restore from archive
	var friendName = req.body.friendName;
	console.log("user email ", req.body.userEmail, " user friend ", req.body.friendName);
	//find user logged in
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
		//run through friends array and find the friend to restore
		docs.friendsMatch.forEach(function(friend, index){
			if(friend.friendName === friendName){
				console.log("found match ", friend.friendName, friend)
				//index of friend matched in array
				indexMatch = index;
				return;
			}
		})
		//if found match update the flag
		if(indexMatch >= 0){
			docs.friendsMatch[indexMatch].friendInArchive = false;
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

//delete friend forever
exports.deleteFriend = function(req, res){
	console.log("deleting from ignore list")
	//friend name to delete
	var friendName = req.body.friendName;
	console.log("user email ", req.body.userEmail, " user friend ", req.body.friendName);
	//find user logged in
	usersSchema.findOne({userEmail : req.body.userEmail}).exec(function(err, docs){
		if(err)
			return console.error(err)
		else
		//run through friends array and find friend to delete
		docs.friendsMatch.forEach(function(friend, index){

			if(friend.friendName === friendName){
				console.log("found match ", friend.friendName, friend)
				// update index in array
				indexMatch = index;
				return;
			}
		})
		//if found match update flag
		if(indexMatch >= 0){
			docs.friendsMatch[indexMatch].deletedFriendFlag = true;
			docs.save(function(err, result){
				if(err)
					return console.error(err);
				console.log("updated ", result)
			});
		}
		res.json({status : 1})
	})
}

