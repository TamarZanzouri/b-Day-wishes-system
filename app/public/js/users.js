(function($) {
    $(function() {
        $('[data-jcarousel]').each(function() {
            var el = $(this);
            el.jcarousel(el.data());
        });

        $('[data-jcarousel-control]').each(function() {
            var el = $(this);
            el.jcarouselControl(el.data());
        });
    });
})(jQuery);
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
        $scope.photos = [
            {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
            {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
            {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
            {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
            {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
            {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
        ];

        // initial image index
        $scope._Index = 0;

        // if a current image is the same as requested image
        $scope.isActive = function (index) {
            return $scope._Index === index;
        };

        // show prev image
        $scope.showPrev = function () {
            $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
        };

        // show next image
        $scope.showNext = function () {
            $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
        };

        // show a certain image
        $scope.showPhoto = function (index) {
            $scope._Index = index;
        };
        $scope.editWish = function($event, wish){
            birthdayWish = angular.element($event.currentTarget)[0].innerHTML;
            console.log(birthdayWish);
            console.log("get edited");
        }

        $scope.moveToPicturePage = function(){
            movePage('picture-list');
        }

        $scope.moveBack = function(){
            history.back();
        }

        $scope.moveToArchive = function(){
            console.log("swiped left");
        }
        /*$http.post("http://localhost:3000/create_user/", { user : $scope.user }).success(function(data){
            console.log(data.friendsMatch);
            $scope.users = data.friendsMatch;
        });*/
            // Set of Photos


    }]);
