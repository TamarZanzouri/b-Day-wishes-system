var app = angular.module("bDay-app",[]);


app.controller('bDay-controller',function($scope){

     $scope.loginPage = true;

    $scope.isLogin = function() {


            $scope.loginPage = false;

    };
       /* $scope.loginPage = true;
        $scope.userPage = false;
        $scope.usersPage = false;*/


});
angular.module('app', ['google.plus.auth'])
    .config(['googlePlusAuthProvider', function (googlePlusAuthProvider) {
        googlePlusAuthProvider.config({
            clientId: 'your OAuth 2.0 client ID'
        });
    }])
    .controller('AppCtrl', [
        '$scope',
        'googlePlusAuth',
        'googlePlusUser',
        function ($scope, googlePlusAuth, googlePlusUser) {
            $scope.user = googlePlusUser;
            $scope.login = function () {
                googlePlusAuth.login();
            };
            $scope.logout = function () {
                googlePlusAuth.logout();
            };
        }
    ]);
//var googleApp = angular.module("googleSignIn", ['directive.g+signin']);
//
//googleApp.controller('ExampleCtrl', function($scope){
//    debugger
//    $scope.$on('event:google-plus-signin-success', function (event,authResult) {
//        // Send login to server or save into cookie
//    });
//    $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
//        // Auth failure or signout detected
//    });
//
//});

//function signinCallback(authResult) {
//    if (authResult['status']['signed_in']) {
//        // Update the app to reflect a signed in user
//        //Hide the sign-in button now that the user is authorized, for example:
//        document.getElementById('signinButton').setAttribute('style', 'display: none');
//
//        gapi.client.load('plus', 'v1', function() {
//
//            var request = gapi.client.plus.people.get({
//                'userId' : 'me'
//            });
//            request.execute(function(resp) {
//
//                console.log(resp);
//                User.name=decodeURI(resp.displayName);
//                User.email= (resp.emails) ?resp.emails[0].value : resp.id
//                User.image = resp.image.url;
//                //Gemail = plus.profile.emails.read
//                // (resp.emails)? resp.emails[0].value : "zanzouritamar@gmail.com";
//                //console.log("email!!!", Gemail)
//                console.log(User);
//                var img = $('<img>').attr("src",User.image);
//                $('#profile-pic').append(img);
//                $('#user-name').append(User.name);
//                // create_user(User);
//                var delay = 3000; //Your delay in milliseconds
//                var scope = angular.element(document.getElementById('yourControllerElementID')).scope().con‌​troller;
//                console.log(scope);
//                debugger
//                setTimeout(function(){ window.location = "users.html"; }, delay);
//            });
//        });
//        // window.location.href = "users.html";
//    } else {
//        /*  Update the app to reflect a signed out user
//         Possible error values:
//         "user_signed_out" - User is signed-out
//         "access_denied" - User denied access to your app
//         "immediate_failed" - Could not automatically log in the user */
//        console.log('Sign-in state: ' + authResult['error']);
//
//    }
//};
