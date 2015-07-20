
//moving between the data-role pages
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
var domain = 'http://localhost:3000';
//'http://mazal-tov.herokuapp.com';

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
//directive which detect an outside click of the notification(desktop) div and close that div when is open
app.directive("outsideClick", ['$document', function( $document){

    return {

        link: function( $scope, $element, $attributes ){
            var scopeExpression = $attributes.outsideClick,
                onDocumentClick = function(event){

                    if((event.target.id).substring(0,(event.target.id).length-1)== 'open'){

                    }
                    else {
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

    //the controller app
    app.controller('AuthCtrl',function ($scope, GooglePlus, $http, UserService, $rootScope, $timeout) {
        $scope.check = true;
        $scope.show = false;
        $scope.User = UserService.name;
        $scope.direction = 'left';
        $scope.userFriend;
        $scope.userFriendBirthday;
        var userForNotification = [];
        var numOfNotifications = 0;
        var ignoreList=[];
        var unIgnoreUsers=[];
        var notificationList=[];
        var notificationTodayList=[];
        var notificationWeekList=[];
        var notificationMonthList=[];
        var $window = $(window);
        var windowsize = $window.width();
        //login with google+ function
        $scope.login = function () {
            GooglePlus.login().then(function (authResult) {

                GooglePlus.getUser().then(function (user) {
                    User.userEmail = user.email;
                    User.userName = user.name;
                    User.profileImage = user.picture;

                    $scope.user = User;
                    movePage('user-friends');
                    //get the friends usres of the login user
                    $http.post(domain + "/create_user/", { user : $scope.user }).success(function(data){
                        //separate to ignore and users
                        userForNotification = data;
                        userForNotification.friendsMatch.forEach(function(item){
                            var daysLength = 0;
                            daysLength = bDay(item.birthDate);
                            //check if the friend supposed to be in notification page in one of todays, this week , this month sections
                            if(item.BirthdayReminderFlag == true && daysLength>0 && item.friendInArchive==false && item.deletedFriendFlag==false){
                                notificationList.push(item);

                                if(daysLength==1){
                                    notificationTodayList.push(item);
                                    numOfNotifications= numOfNotifications + 1;
                                }
                                else if(daysLength==2){
                                    notificationWeekList.push(item);
                                }
                                else if(daysLength==3){
                                    notificationMonthList.push(item);
                                }

                            }
                            //check if the friend is in the friend user list
                            if(item.friendInArchive == false && item.deletedFriendFlag==false){
                                unIgnoreUsers.push(item);
                            }
                            //check if the friend is in the ignore list
                            else if(item.deletedFriendFlag == false){
                                ignoreList.push(item);
                            }
                        });
                        $scope.notificationsNum = numOfNotifications;
                        $scope.todays = notificationTodayList;
                        $scope.weeks = notificationWeekList;
                        $scope.months = notificationMonthList;
                        $scope.notificationsUser = notificationTodayList;
                        $scope.users = unIgnoreUsers;
                        $scope.ignors = ignoreList;
                    });

                });
            }, function (err) {
            });
        };
        // function which calculate how many days each user has until the bDay
        $scope.calculateDays = function(date){
            var days = 0;
            Date.prototype.today = function () {
                return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
            }

            var datetime = (new Date().today());
            datetime=datetime.toString().split('/');
            date=date.toString().split('/');
            var year = parseInt(date[2]);
            var month = parseInt(date[1]);
            var day = parseInt(date[0]);

            if(month==parseInt(datetime[1])){//if its the same month
                if(day>=parseInt(datetime[0])){
                    days = day - parseInt(datetime[0]);
                }
                else{
                    days = 365 - (parseInt(datetime[0])-day);
                }
            }
            else if(month>parseInt(datetime[1])){//if the birthDate month is bigger the today month
                days = (month - parseInt(datetime[1]))*30;
                days += (day - parseInt(datetime[0]));
            }
            else{//if the birthDate month is smaller the today month

                days = parseInt(datetime[1]) - month;
                days*=30;
                days+= day -parseInt(datetime[0]);
            }
            if(days == '0'){
                return 'היום!';
            }
            else{
                var str = 'עוד';
                str+=' '+days+' ';
                str+='ימים';
                return str;

            }
            days = 0;

        }
        //change background-color according to the index position on the list of users
        $scope.$on('onRepeatLast', function(scope, element, attrs){
            var colors =['#df547d','#fea579','#e5d58b','#30beb2'];
            for(var i= 0, j=0;i<scope.currentScope.users.length;i++){
                if(i==4){
                    j=0;
                }
                $('#friends-'+i+'').css('background-color',colors[j++]);
            }
        });
        //get and display the bDay wishes
        $scope.getBirthdayWishes = function(userFriend){

            $scope.userFriend = userFriend.friendName;
            $scope.userFriendBirthday = userFriend.birthDate;
            $scope.name = userFriend.friendName;
            $scope.friendsBirthday = userFriend.birthDate;
            $scope.daysLeft = $scope.calculateDays(userFriend.birthDate);
            $http.post(domain + "/getMyFriendsBirthDayWishes",
                { user : User.userEmail, friend :  userFriend.friendshipCatagory}).success(function(data){
                    $scope.wishes = data;
                    movePage('loading');

                    var index=2;
                    var interval = window.setInterval(function(){//interval for changing img in loading page
                        if(index==4){
                            index=1;
                        }
                        changeBackground(index++);
                     }, 500);
                    setTimeout(function(){
                        clearInterval(interval);
                        $('.notifications').css('background-image', "url(" + 'imgs/notification.png)');
                        movePage('birthday-wishes');

                    },3000);

            });

        };
        //change colors and images on loading page
        function changeBackground(index) {

            var colors =['#CF3D6A','#30beb2','#df547d'];
            $('.change-welcome-txt').css('color',colors[index-1]);
            $('.logoLoading').css("background-image","url("+'imgs/logo'+index+'.png)');
            $('#switching-icon').css("background-image","url("+'imgs/switching-img'+index+'.png)');


        };

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
        // edit on wishes page
        $scope.editWish = function($event, wish){
            birthdayWish = angular.element($event.currentTarget)[0].innerHTML;

        };
        //change selected wish color
        $scope.editCSS = function($event){
            //need to solve this issue
            $scope.check = false;
            angular.element($event.target).parent().addClass('changeCSS');
        }
        //move to confirm page
        $scope.moveToConfirmPage = function(){
            $scope.picture = $('.active')[0].children[0].currentSrc;
            movePage('confirm-page');
            $scope.wish = birthdayWish;
        }
        //move to home page
        $scope.moveToHomePage = function(){
            movePage('login-page');

        }
        //move to user friends page
        $scope.moveToUserFriends = function(){
            movePage('user-friends');
        }
        //move to ignore page
        $scope.moveToIgnoreList = function(){
            $('.notifications').css('background-image', "url(" + 'imgs/notification.png)');
            movePage('ignore-friends');
        }
        //move to picture page
        $scope.moveToPicturePage = function(){
            $http.post(domain + "/getSharedPictures",
            { user : User.userEmail, friendName :  $scope.userFriend}).success(function(data){

                    $scope.photos = data;
                    movePage('picture-list');
            });  
        }
        //move to the last page
        $scope.moveBack = function(){
            $scope.check = true;
            history.back();
        }
        //show reminder icon on swipe left
        $scope.showReminer = function(index){
            $scope.direction = 'left';
            if($('#' + index + '>img.moveToArcive').hasClass('active')){
                $('#' + index + '>img.moveToArcive').removeClass('active');
                $('#' + index + ' div.friend-img').css("display", "block");
                $('#' + index + ' div.friend-days-left').css("padding-left", "10px");
                $('#' + index + ' div.friend-name').css("padding-left", "0px");
            }
            else{
                $('#' + index + ' div.friend-days-left').css("display", "none");
                $('#' + index).css("padding-right", "58px");
                $('#' + index + '>img.addReminder').addClass('active');
            }

        }
        //show archive icon on swipe right
        $scope.showArchive = function(index){
            $scope.direction = 'right';
            if($('#' + index + '>img.addReminder').hasClass('active')){
                $('#' + index + '>img.addReminder').removeClass('active');
                $('#' + index + ' div.friend-days-left').css("display", "block");
                $('#' + index).css("padding-right", "0px");
            }
            else
            {
                $('#' + index + ' div.friend-img').css("display", "none");
                $('#' + index + ' div.friend-days-left').css("padding-left", "58px");
                $('#' + index + ' div.friend-name').css("padding-left", "58px");
                $('#' + index + '>img.moveToArcive').addClass('active');
            }
        }
        //show delete icon on archive page on swipe
        $scope.showArchiveIgnore = function(index){
            console.log(index);
            if($('#' + index + '>img.restore-friend').hasClass('active')){
                $('#' + index + '>img.restore-friend').removeClass('active');
                $('#' + index + ' div.friend-img').css("display", "block");
                $('#' + index + ' div.friend-name-ignore').css("padding-right", "17px");
            }
            else{
                $('#' + index).css("padding-right", "58px");
                $('#' + index + '>img.moveToArciveIgnore').addClass('active');                
            }

        }
        //show recall icon on swipe
        $scope.showRecallIgnore = function(index){
            if($('#' + index + '>img.moveToArciveIgnore').hasClass('active')){
                $('#' + index + '>img.moveToArciveIgnore').removeClass('active');
                $('#' + index).css("padding-right", "0px");
            }
            else{
                $('#' + index + ' div.friend-img').css("display", "none");
                $('#' + index + ' div.friend-name-ignore').css("margin-left", "0px");
                $('#' + index + '>img.restore-friend').addClass('active');
            }
        }
        //delete an user friend from the archive page
        $scope.deleteFriend = function(users, user, index){
            $http.post(domain + '/deleteFriend' , {friendName : user.friendName, userEmail : User.userEmail}).success(function(data){

                $scope.indexInArray = index.substring(index.length, index.length-1);
                $scope.ignors.splice($scope.indexInArray, 1);
                $('#' + index + '>img.restore-friend').removeClass('active');
                $('#' + index + ' div.friend-img').css("display", "block");
                $('#' + index + ' div.friend-name-ignore').css("padding-left", "0px");
                $scope.alerts = [
                    { type: 'danger', msg: 'חבר נמחק לצמיתות' }
                ]; 
                $timeout(function() {
                    $scope.alerts.splice(index, 1);
                }, 3000);

            })
        }
        //transfer an user from archive page to the friend user page
        $scope.restoreFriend = function(users, user, index){

            $http.post(domain + '/restoreFromArchive' , {friendName : user.friendName, userEmail : User.userEmail}).success(function(data){

                $scope.users.push(user);
                $scope.indexInArray = index.substring(index.length, index.length-1);
                $scope.ignors.splice($scope.indexInArray, 1);
                $('#' + index + '>img.restore-friend').removeClass('active');
                $('#' + index + ' div.friend-img').css("display", "block");
                $('#' + index + ' div.friend-name-ignore').css("padding-left", "0px");
                $scope.alerts = [
                    { type: 'danger', msg: 'החבר נוסף לרשימת החברים' }
                ]; 
                $timeout(function() {
                    $scope.alerts.splice(0, 1);
                }, 3000);

            })
        }
        //open notification div(desktop) or move to notification page
        $scope.openNotifications = function(){


            if (windowsize > 740) {//if the window is greater than 740px


                 if( wasHere){
                 $scope.show = false;
                 $('body').css('opacity','1');
                  wasHere = 0;

                 }
                 else{
                 $('body').css('opacity','0.8');
                 $scope.show = true;
                 wasHere=1;
                 }

            }
            else{
                movePage('notification-page');
            }


        };
        //click on logo on desktop mode
        $scope.goHome = function(){

            if (windowsize > 740) {

                movePage('user-friends');
            }
           return;
        }
        //close notification page
        $scope.closeNotifications = function(){
            history.back();

        }
        //close settings page
        $scope.closeSettings = function(){
            history.back();

        }
        //hide the notification div
        $scope.hide = function() {
                $scope.show = false;
                $('body').css('opacity','1');

        }
        //return if user has bDay today, this week or this month
        function bDay(date){
            console.log(date);
            Date.prototype.today = function () {
                return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
            }
            var datetime = (new Date().today()).split('/');
            var date = date.split('/');
            if(parseInt(date[1])==parseInt(datetime[1])){//same month
                if(parseInt(date[0])==parseInt(datetime[0])){
                    return 1;
                }
                else if(parseInt(date[0])-parseInt(datetime[0]) > 0 && parseInt(date[0])-parseInt(datetime[0]) <=7){
                    return 2;
                }
                else if(parseInt(date[0])-parseInt(datetime[0]) <=30 && parseInt(date[0])-parseInt(datetime[0]) >0){
                    return 3;
                }
                return -1;
            }
            else if(parseInt(date[1])-parseInt(datetime[1]) == 1){//following month

                if(parseInt(date[0])+30-parseInt(datetime[0])<=7){
                    return 2;
                }
                else if(parseInt(date[0])+30-parseInt(datetime[0])<=30){
                    return 3;
                }

            }
            return -1;

        }

        //add user to notification page
        $scope.addReminder = function($event, user, index){

            user.BirthdayReminderFlag = true;
            $scope.found = false;
            $http.post(domain + '/updateReminderFlag' , 
                {friendName : user.friendName, userEmail : User.userEmail}).success(function(data){
                $('#' + index + ' div.friend-days-left').css("display", "block");
                $('.addReminder').removeClass('active');
                $('#' + index).css("padding-right", "0px");
                var bDayCategory = bDay(user.birthDate);

                notificationList.forEach(function(checkUser){

                    if(checkUser.friendName === user.friendName){
                        $scope.found = true;
                        return;
                    }
                });
                    //add the user to today, this wee, this month section
                if(bDayCategory==1 && $scope.found == false)
                {
                    notificationTodayList.push(user);
                    numOfNotifications= numOfNotifications + 1;
                    $scope.notificationsNum = numOfNotifications;

                }
                else if(bDayCategory==2 && $scope.found == false){
                    notificationWeekList.push(user);
                }
                else if(bDayCategory==3 && $scope.found == false){
                    notificationMonthList.push(user);
                }
                //message on notification
                $scope.alerts = [
                    { type: 'success', msg: 'נוספה תזכורת' }
                ]; 
                $timeout(function() {
                    $scope.alerts.splice(0, 1);
                }, 3000);
            })
            }
        //message on published
        $scope.published = function(){
            $scope.alerts = [
                { type: 'success', msg: 'הברכה פורסמה בהצלחה' }
            ];
            $timeout(function() {
                $scope.alerts.splice(0, 1);
                movePage('user-friends');

            }, 3000);
        }
        //transfer user to archive page
        $scope.moveToArchive = function(users, user, index){
            $scope.indexInArray = index.substring(index.length, index.length-1);
            $scope.found = false;
            $http.post(domain + '/addToArchive' , {friendName : user.friendName, userEmail : User.userEmail}).success(function(data){
                notificationList.forEach(function(checkUser){

                    if(checkUser.friendName === user.friendName){
                        $scope.found = true;
                        return;
                    }
                });
                //checking if the user exist on the notification page and remove him
                if($scope.found == true){
                    var bDayCategory = bDay(user.birthDate);
                    if(bDayCategory==1)
                    {
                        notificationTodayList.splice($scope.indexInArray, 1);
                        numOfNotifications= numOfNotifications - 1;
                        $scope.notificationsNum = numOfNotifications;
                    }
                    else if(bDayCategory==2){
                        notificationWeekList.splice($scope.indexInArray, 1);
                    }
                    else if(bDayCategory==3){
                        notificationMonthList.splice($scope.indexInArray, 1);
                    }  
                }   
                $scope.ignors.push(user);
                $scope.users.splice($scope.indexInArray, 1);
                $('#' + index + '>img.moveToArcive').removeClass('active');
                $('#' + index + ' div.friend-img').css("display", "block");
                $('#' + index + ' div.friend-days-left').css("padding-left", "10px");
                $('#' + index + ' div.friend-name').css("padding-left", "0px");

                $scope.alerts = [
                    { type: 'danger', msg: 'החבר הועבר לרשימת הארכיון' }
                ]; 
                $timeout(function() {
                    $scope.alerts.splice(0, 1);
                }, 3000);

            })
        }
    })



