function movePage(page){
    $.mobile.changePage("#"+page, {
        transition : "none",
        changeHash : true
    });
};

var User = {};

var app = angular.module('app', ['googleplus']);

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
app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
})


    app.controller('AuthCtrl', ['$scope', 'GooglePlus', '$http', 'UserService', '$rootScope',function ($scope, GooglePlus, $http, UserService, $rootScope) {
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
                    movePage('user-friends');
                    $http.post("http://localhost:3000/create_user/", { user : $scope.user }).success(function(data){
                        console.log(data.friendsMatch);
                        $scope.users = data.friendsMatch;
                    });
                });
            }, function (err) {
                console.log(err);
            });
        };
        $scope.$on('onRepeatLast', function(scope, element, attrs){
            /*need to think of logic here*/
            $('#0').css('background-color','#df547d');
            $('#1').css('background-color','#fea579');
            $('#2').css('background-color','#e5d58b');
            $('#3').css('background-color','#30beb2');
            var test = scope;
            var test2 = element;
            var test3 = attrs;

        });
        $scope.getBirthdayWishes = function(userFriend){

            console.log("getting getBirthdayWishes " , userFriend, " eamil", User.userEmail)
            $http.post("http://localhost:3000/getMyFriendsBirthDayWishes",
                { user : User.userEmail, friend :  userFriend}).success(function(data){
                    console.log(data);
                    $scope.wishes = data;
                    movePage('birthday-wishes');
            });

        };
        $scope.editWish = function(){
            console.log("get edited");
        }


    }]);