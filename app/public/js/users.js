function movePage(page){
    $.mobile.changePage("#"+page, {
        transition : "none",
        changeHash : true

    });
};

var User = {};
var birthdayWish;

var app = angular.module('app', ['googleplus', 'ngAnimate', 'ngTouch']);

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
            //                 $http.post("http://localhost:3000/getMyFriendsBirthDayWishes",
            //     { user : User.userEmail, friend :  1}).success(function(data){
            //         console.log(data);
            //         $scope.wishes = data;
            //         movePage('birthday-wishes');
            // });
                });
            }, function (err) {
                console.log(err);
            });
        };
        $scope.calculateDays = function(date){
            var days = 0;
            Date.prototype.today = function () {
                return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
            }

            var datetime = (new Date().today());
            datetime=datetime.toString().split('/');
            date=date.toString().split('/');
            year = date[2];
            month = date[1];
            day = date[0];



            if(month==datetime[1]){
                if(day<=datetime[0]){
                    days = datetime[0]-day;
                }
                else{
                    days = 365-(day-datetime[0]);
                }
            }
            else if(month>datetime[1]){
                days = (month - datetime[1])*30;
                days += (datetime[0] - day);
            }
            else{
                days = datetime[1] - month;
                days*=30;
                days+=datetime[0] - day;
                
                days = 365 - days;
            }
            console.log(days);
            
            if(days == '0'){
                return 'היום!';
            }
            else{
                var str = 'עוד';
                str+=' '+days+' ';
                str+='ימים';
                console.log(str);
                return str;

            }
            days = 0;

        }
        $scope.$on('onRepeatLast', function(scope, element, attrs){
            var colors =['#df547d','#fea579','#e5d58b','#30beb2'];
            for(var i= 0, j=0;i<scope.currentScope.users.length;i++){
                if(i==3){
                    j=0;
                }
                $('#'+i+'').css('background-color',colors[j++]);
            }
        });
        $scope.getBirthdayWishes = function(userFriend){

            console.log("getting getBirthdayWishes " , userFriend, " email", User.userEmail)
            $http.post("http://localhost:3000/getMyFriendsBirthDayWishes",
                { user : User.userEmail, friend :  1}).success(function(data){
                    console.log(data);
                    $scope.wishes = data;
                    movePage('birthday-wishes');
            });

        };
        $scope.editWish = function($event, wish){
            birthdayWish = angular.element($event.currentTarget)[0].innerHTML;
            console.log(birthdayWish)
            console.log("get edited");
        }

        $scope.moveToPicturePage = function(){
            movePage('picture-list');
        }

        $scope.moveBack = function(){
            history.back();
        }

        $scope.moveToArchive = function(){
            console.log("swiped ledt")
        }
    }]);
