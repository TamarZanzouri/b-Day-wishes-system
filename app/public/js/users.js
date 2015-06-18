var User = {};
var greetings=[];

    function Box(iCurrentBox,pageName) {
        console.log(greetings);

        var iCount  = iCurrentBox;
        switch (pageName) {


            case "b-Day whishes system - users":
                //the number of Box

                var boxObj = document.createElement('article');//create an Element
                var id = iCount + 1;
                boxObj.className = 'user-row';
                var img = document.createElement('div');
                img.className = 'user-row-profile-pic';
                var profilepic = document.createElement('a');
                profilepic.id = 'user-profile-pic';
                profilepic.href = 'user.html';
                var name = document.createElement('div');
                name.className = 'user-row-name';
                var userName = document.createElement('h3');
                userName.id = 'userName';
                userName += "יעל רז";
                var bday = document.createElement('h6');
                bday.id = 'user-bday-date';
                bday += "15.7.15";

                var remaining = document.createElement('div');
                remaining.className = 'user-row-remainingDays';
                //remaining += "עוד 20 ימים";
                //get the commercial data from the json file

                /*$.getJSON("includes/product.json", function (data) {
                 $.each(data.commercials, function (key, val) {
                 if (val.id == id) {
                 console.log("here");
                 name.innerHTML = val.commercial;
                 $(name).append('<h5>' + val.watch + '</h5>');
                 $(img).append('<img src="images/comm' + id + '.jpg" alt="' + val.title + '" title="' + val.title + '" >');
                 $(details).prepend('' + val.date + '<h5>' + val.left + '</h5>');

                 }

                 });
                 });*/
                img.appendChild(profilepic);
                $(name).append('<h3 id="userName">יעל רז</h3>');
                $(name).append('<h6 id="user-bday-date">15.7.15</h6>');
                boxObj.appendChild(img);
                boxObj.appendChild(name);
                $(remaining).append('<h4>עוד 20 יום</h4>');
                boxObj.appendChild(remaining);
                $('section').first().append(boxObj);

                break;
            case "b-Day whishes system - user":
                var boxObj = document.createElement('article');//create an Element
                var id = iCount + 1;
                boxObj.className = 'user-row';
                console.log(iCount);
                $(boxObj).append('<p>'+ greetings[iCount]+'</p>');
                $('.user-body').append(boxObj);
                break;
            default :
                break;
        };

    }

    function IBoxsManager(boxNum,pageName) {
        var iboxNum = boxNum; //how many Boxes when window on load
        console.log(greetings);

        for (var i = 0; i < iboxNum; i++) {
            //Create new Box instance
            var box = new Box(i, pageName);
            console.log("Box ");
        }

    }

    $(document).ready(function(){

        $.ajax({
            type: "get",
            url: "http://localhost:3000/",// where you wanna post
            dataType: "json",
            error: function(jqXHR, textStatus, errorMessage) {
                console.log(errorMessage)
            },
            success: function(data) {
                // console.log("update success to add to the favorite");
                //console.log(data)
                console.log(data[0].greetingsValue);




                $.each(data, function(key, val){
                    console.log(val.greetingsValue);

                    greetings.push(val.greetingsValue);

                });
                console.log(greetings);
                path();
            }

         });
        function path(){
        var title = document.getElementsByTagName("title")[0].innerHTML;
        switch (title){
            case "b-Day whishes system - user":

                var numofUsers=9;
                var iBoxsManager = new IBoxsManager(numofUsers,title);//create the commercials boxes
                break;
            case "b-Day whishes system - users":
                var numofUsers=9;
                var iBoxsManager = new IBoxsManager(numofUsers,title);//create the commercials boxes
                break;
            default :
                break;
        }




    };
    });

function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        // Update the app to reflect a signed in user
        //Hide the sign-in button now that the user is authorized, for example:
        document.getElementById('signinButton').setAttribute('style', 'display: none');

        gapi.client.load('plus', 'v1', function() {

            var request = gapi.client.plus.people.get({
                'userId' : 'me'
            });
            request.execute(function(resp) {

                console.log(resp);
                User.name=decodeURI(resp.displayName);
                User.email= (resp.emails) ?resp.emails[0].value : resp.id
                User.image = resp.image.url;
                //Gemail = plus.profile.emails.read
                // (resp.emails)? resp.emails[0].value : "zanzouritamar@gmail.com";
                //console.log("email!!!", Gemail)
                console.log(User);
                var img = $('<img>').attr("src",User.image);
                $('#profile-pic').append(img);
                $('#user-name').append(User.name);
                // create_user(User);
                var delay = 3000; //Your delay in milliseconds

                setTimeout(function(){ window.location = "users.html"; }, delay);
            });
        });
        // window.location.href = "users.html";
    } else {
        /*  Update the app to reflect a signed out user
         Possible error values:
         "user_signed_out" - User is signed-out
         "access_denied" - User denied access to your app
         "immediate_failed" - Could not automatically log in the user */
         console.log('Sign-in state: ' + authResult['error']);

        }
    }

// function create_user(User){
//       $.ajax({
//         type: "post",
//         url: "http://localhost:3000/",// where you wanna post
//         dataType: "json",
//         error: function(jqXHR, textStatus, errorMessage) {
//             console.log(errorMessage)
//         },
//         success: function(data) {
//             // console.log("update success to add to the favorite");
//             //console.log(data)
//             console.log(data[0].greetingsValue);




//             $.each(data, function(key, val){
//                 console.log(val.greetingsValue);

//                 greetings.push(val.greetingsValue);

//             });
//             console.log(greetings);
//             path();
//         }

// });
// }

