

function movePage(page){
    $.mobile.changePage("#"+page, {
        transition : "none",
        changeHash : true

    });
};

var User = {};
var birthdayWish;
var wasHere = 0;
var app = angular.module('app', ['googleplus', 'ngAnimate', 'ngTouch', 'swipe', 'ui.bootstrap']);

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
});
app.directive("outsideClick", ['$document', function( $document){

    return {

        link: function( $scope, $element, $attributes ){
            var scopeExpression = $attributes.outsideClick,
                onDocumentClick = function(event){
                    if(event.target.id == 'open'){
                        console.log('notifications');

                    }
                    else {
                        console.log('here');
                        $scope.$apply(scopeExpression);

                    }

                };

            $document.on("click", onDocumentClick);

            $element.on('$destroy', function() {
                $document.off("click", onDocumentClick);
            });
        }
    }
}]);


    app.controller('AuthCtrl',function ($scope, GooglePlus, $http, UserService, $rootScope) {
        $scope.check = true;
        $scope.show = false;
        $scope.User = UserService.name;
        $scope.direction = 'left';
        $scope.userFriend;
        $scope.userFriendBirthday;
        var userForNotification = [];
        var numOfNotifications = 0;

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
                    var ignoreList=[];
                    var unIgnoreUsers=[];
                    var notificationList=[];

                    $http.post("http://localhost:3000/create_user/", { user : $scope.user }).success(function(data){
                        //separate to ignore and users
                        userForNotification = data;
                        userForNotification.friendsMatch.forEach(function(item){
                            console.log(item);
                            if(item.BirthdayReminderFlag == true && bDayNotice(item.birthDate) && item.friendInArchive==false){
                                notificationList.push(item);
                                console.log(item);
                                numOfNotifications= numOfNotifications + 1;
                                console.log("num of notifications:" +numOfNotifications);

                            }
                            if(item.friendInArchive == false){
                                unIgnoreUsers.push(item);
                            }
                            else{
                                ignoreList.push(item);
                            }
                        });
                        $scope.notificationsNum = numOfNotifications;
                        $scope.notificationsUser = notificationList;
                        console.log(data.friendsMatch);
                        $scope.users = unIgnoreUsers;
                    });

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
            var year = date[2];
            var month = date[1];
            var day = date[0];



            if(month==datetime[1]){
                if(day>=datetime[0]){
                    days = day - datetime[0];
                }
                else{
                    days = 365 - (datetime[0]-day);
                }
            }
            else if(month>datetime[1]){
                days = (month - datetime[1])*30;
                days += (day - datetime[0]);
            }
            else{

                days = datetime[1] - month;
                days*=30;
                days+= day -datetime[0];
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
        $scope.getBirthdayWishes = function(userFriend, userFriendBirthday){

            console.log("getting getBirthdayWishes " , userFriend, " email", User.userEmail)
            $scope.userFriend = userFriend;
            $scope.userFriendBirthday = userFriendBirthday;
            $scope.name = userFriend;
            $scope.friendsBirthday = userFriendBirthday;
            $scope.daysLeft = $scope.calculateDays(userFriendBirthday);
            console.log($scope.userFriend, $scope.userFriendBirthday)
            $http.post("http://localhost:3000/getMyFriendsBirthDayWishes",
                { user : User.userEmail, friend :  1}).success(function(data){
                    console.log(data);
                    $scope.wishes = data;
                    movePage('birthday-wishes');
            });

        };
        // $scope.photos = [
        //     {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
        //     {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
        //     {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
        //     {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
        //     {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
        //     {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
        // ];

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
        };
        $scope.editCSS = function($event){
            //need to solve this issue
            $scope.check = false;
            angular.element($event.target).parent().addClass('changeCSS');
        }

        $scope.moveToConfirmPage = function(){
            $scope.picture = $('.active')[0].children[0].currentSrc;
            console.log('moveToConfirmPage');
            movePage('confirm-page');
            $scope.wish = birthdayWish;
        }
        $scope.moveToHomePage = function(){
            console.log('moveToHomePage');
            movePage('login-page');

        }
        $scope.moveToIgnoreList = function(){
            console.log('moveToIgnoreList');
            movePage('ignore-friends');
        }
        $scope.moveToPicturePage = function(){
            $http.post("http://localhost:3000/getSharedPictures",
            { user : User.userEmail, friendName :  $scope.userFriend}).success(function(data){
                    console.log(data);
                    //console.log( $scope.photos = data);
                    $scope.photos = data;
                    movePage('picture-list');
            });  
        }

        $scope.moveBack = function(){
            $scope.check = true;
            history.back();
        }

        $scope.showReminer = function(index){
            $scope.direction = 'left';
            if($('#' + index + '>img.moveToArcive').hasClass('active')){
                $('#' + index + '>img.moveToArcive').removeClass('active');
                $('#' + index + ' div.friend-img').css("display", "block");
                $('#' + index + ' div.friend-days-left').css("padding-left", "0px");
                $('#' + index + ' div.friend-name').css("padding-left", "0px");
            }
            else{
                console.log($('#' + index + '.friend-days-left'));
                $('#' + index + ' div.friend-days-left').css("display", "none");
                $('#' + index).css("padding-right", "58px");
                $('#' + index + '>img.addReminder').addClass('active');
            }

            console.log("swiped left");
        }

        $scope.showArchive = function(index){
            $scope.direction = 'right';
            if($('#' + index + '>img.addReminder').hasClass('active')){
                console.log("in if")
                $('#' + index + '>img.addReminder').removeClass('active');
                $('#' + index + ' div.friend-days-left').css("display", "block");
                $('#' + index).css("padding-right", "0px");
            }
            else
            {
                console.log("in else")
                $('#' + index + ' div.friend-img').css("display", "none");
                $('#' + index + ' div.friend-days-left').css("padding-left", "58px");
                $('#' + index + ' div.friend-name').css("padding-left", "58px");
                $('#' + index + '>img.moveToArcive').addClass('active');
            }
            console.log("swiped right")  ;
        }
        $scope.openNotifications = function(){
            if( $scope.notificationsNum == 0){
                $scope.show = false;
                $('body').css('opacity','1');
                var wasHere = 1;

            }
            else{
                $scope.notificationsNum = 0;
                $('body').css('opacity','0.8');
                $scope.show = true;
            }
        };
        $scope.hideSideMenu = function() {
                $scope.show = false;
                $('body').css('opacity','1');
                console.log(wasHere);

        }

        function bDayNotice(date){
            console.log(date);
            Date.prototype.today = function () {
                return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
            }

            var datetime = (new Date().today()).split('/');
            var date = date.split('/');
            if(date[1]==datetime[1]){
                if(date[0]==datetime[0]){
                    return true;
                }
                if(date[0]-datetime[0]==1){
                    return true;
                }
            }
            else{
                return false;
            }

        }
        $scope.addReminder = function($event, user, index){
            user.BirthdayReminderFlag = true;
            $http.post('http://localhost:3000/updateReminderFlag' , 
                {friendName : user.friendName, userEmail : User.userEmail}).success(function(data){
                console.log(data);
                // $('#' + index + ' div.friend-days-left').css("display", "block");
                // $('.addReminder').removeClass('active');
                // $('#' + index).css("padding-right", "0px");
            })
            }


        $scope.moveToArchive = function(users, user, index){
            // console.log(angular.element($event.target).parent());
            console.log(user);
            $http.post('http://localhost:3000/addToArchive' , {friendName : user.friendName, userEmail : User.userEmail}).success(function(data){
                console.log(data);
                $scope.users.splice(index, 1);
                // $('#' + index + ' div.friend-days-left').css("display", "block");
                // $('.addReminder').css("display" , "none");
                // $('#' + index).css("padding-right", "0px");
            })
            /*need to update the DB in friendArchived*/
        }
    })

    app.animation('.slide-animation', function () {
        console.log("in animation")
        return {
        addClass: function (element, className, done) {
            var scope = element.scope();
            console.log("חליכלחדכג", className)
            if (className != 'ng-hide') {
                console.log("hide")
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.set(element, { left: startPoint });
                TweenMax.to(element, 0.5, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }





    };
});

