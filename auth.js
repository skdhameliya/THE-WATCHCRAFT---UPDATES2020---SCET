
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById("spinnerIndex").style.display = "none";
      document.getElementById("marqueeTag").style.display = "none";
        document.getElementById("BtnLogin").style.display = "none";
        document.getElementById("BtnLogout").style.display = "block";
        userGoogle = firebase.auth().currentUser;
        if (userGoogle != null) {
            name1 = userGoogle.displayName;
            currentEmail1 = userGoogle.email;
            photoUrl1 = userGoogle.photoURL;
        }

        if( sessionStorage.getItem("sessionUserImage1") && sessionStorage.getItem("sessionWelcomeUser1") && sessionStorage.getItem("sessionCurrentEmail") ){
            // alert("session");
            document.getElementById("spinnerIndex").style.display = "none";
            document.getElementById("userInfoIndex").style.display = "block";

            document.getElementById("userImage").src = photoUrl1;
            document.getElementById("welcomeUser").innerHTML = "Welcome, " + name1;
            document.getElementById("currentEmail").innerHTML = "Gmail : " + currentEmail1;
            
            if(sessionStorage.getItem("r1Score")>0){
                document.getElementById("r1Btn").style.display = "none";
                document.getElementById("completedR1").style.display = "block"; 
            }else{
                document.getElementById("r1Btn").style.display = "block";
                document.getElementById("completedR1").style.display = "none"; 
            }

        }else{
            // alert("else session");
            checkUserInDB();
        }

    } else {
      // No user is signed in.
      document.getElementById("spinnerIndex").style.display = "none";
      document.getElementById("marqueeTag").style.display = "block";
      document.getElementById("BtnLogin").style.display = "block";
      document.getElementById("BtnLogout").style.display = "none";
    }
});

function userLogin(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // var token = result.credential.accessToken;
        // var user = result.user;
    }).catch(function(error) {
        alert("Error in login : "+error.message);
        // var email = error.email;
        // var credential = error.credential;
    });
}

function userLogout(){
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful");
        sessionStorage.removeItem("sessionUserImage1");
        sessionStorage.removeItem("sessionWelcomeUser1");
        sessionStorage.removeItem("sessionCurrentEmail");
        document.getElementById("userInfoIndex").style.display = "none";
        document.getElementById("r1Btn").style.display = "none";
        document.getElementById("completedR1").style.display = "none"; 
        // sessionStorage.clear();
        // sessionStorage.removeItem("userMobile");
        setTimeout(function(){ 
            window.location = "index.html";
        }, 1000);
    }).catch(function(error) {
        // An error happened.
        alert("Error in logout : " + error.message);
        window.location = "index.html";
    });    
}

function checkUserInDB(){
    // alert(sessionStorage.getItem("r2Score"));
    var strEmail1 = currentEmail1;
    var n = strEmail1.indexOf("@");
    var splitted = strEmail1.substring(0, n);
    
    var n1 = splitted.indexOf(".");
    if(n1 != -1){
    	splitted = splitted.slice(0, n1) + splitted.slice(n1+1, splitted.length); 
    }
    console.log("splitted --- "+splitted);
    // console.log(strEmail1+"----"+splitted);
    sessionStorage.setItem("splittedGmail", splitted);
    // console.log("session splitted => "+sessionStorage.getItem("splittedGmail"));

    firebase.database().ref('usr1/' + splitted).on('value', function(snapshot){
        if(snapshot.val()){
            // console.log("data found");
            document.getElementById("spinnerIndex").style.display = "none";
            document.getElementById("userInfoIndex").style.display = "block";

            document.getElementById("userImage").src = photoUrl1;
            document.getElementById("welcomeUser").innerHTML = "Welcome, " + name1;
            document.getElementById("currentEmail").innerHTML = "Gmail : " + currentEmail1;

            sessionStorage.setItem("sessionUserImage1", photoUrl1);
            sessionStorage.setItem("sessionWelcomeUser1", name1);
            sessionStorage.setItem("sessionCurrentEmail", currentEmail1);

            // console.log(snapshot.val().r1Score);
            if(snapshot.val().r1Score > 0){
                document.getElementById("completedR1").style.display = "block"; 
                document.getElementById("r1Btn").style.display = "none";
            }else{
                document.getElementById("completedR1").style.display = "none"; 
                document.getElementById("r1Btn").style.display = "block";
            }
            sessionStorage.setItem("r1Score", snapshot.val().r1Score);
        }else{
            // console.log("not found");
            alert(strEmail1 + " is not registered.");
            document.getElementById("userInfoIndex").style.display = "none";
        }
    });
}

function rndOneStart(){
    var r = confirm("20 questions (3 minutes) will be given to complete the quiz. You can not go back after starting the round-1. Do you want to start round-1?");
    if (r == true) {
        var split1 = sessionStorage.getItem("splittedGmail");
        var startTime1 = new Date();
        // console.log("start time = "+startTime1);
        sessionStorage.setItem("startTime", startTime1);
        setTimeout(function(){ 
            window.location = "./rnd1.html"; 
        }, 2000);
        
    }
}