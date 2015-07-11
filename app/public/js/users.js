function movePage(page){
    console.log(page);
    $.mobile.navigate( "#user-friends", { transition : "slide", info: "info about the #bar hash" });
};

var app = angular.module('app', ['googleplus']);

var User = {};

app.factory('UserService', function() {
  return {
      user : {}
      // domain : 'http://localhost:3000/'
  };
});

app.config(['GooglePlusProvider', function(GooglePlusProvider) {
    GooglePlusProvider.init({
        clientId: '666209132044-6elo4bn0otp9jpjet2ec4gj9f6m2ju85.apps.googleusercontent.com',
        apiKey: 'AIzaSyBcCYG489_GsQic14u623DBLCKjhc1ynvE'
    });
   }]);

    app.controller('AuthCtrl', ['$scope', 'GooglePlus', '$http', 'UserService', '$location', '$anchorScroll',function ($scope, GooglePlus, $http, UserService, $location, $anchorScroll) {
        $scope.User = UserService.name;
        // $scope.g_domain = UserService.domain;
        $scope.login = function () {
            console.log("in login")
            GooglePlus.login().then(function (authResult) {
                console.log(authResult);

                GooglePlus.getUser().then(function (user) {
                    console.log(user.email);
                    User.userEmail = user.email;
                    User.userName = user.name;
                    User.profileImage = user.picture;
                    $scope.user = User;
                    console.log($scope.user);
                    // $location.hash('user-friends');
                    // $anchorScroll();
                    $http.post("http://localhost:3000/create_user/", { user : $scope.user }).success(function(data){
                        console.log(data)
                        $scope.users = data.friendsMatch;
                    });
                });
            }, function (err) {
                console.log(err);
            });
        };


    }]);