
// window.onbeforeunload = myffnn();
// {
    // return confirm("Confirm refresh");
    // return confirm("If you reload the page, your score will be set to 0 and your time will not be resetted. Do you want to reload?");
// };
// function myffnn(){
//     alert("If you reload the page, your score will be set to 0 and your time will not be resetted. Do you want to reload?");
// }

if(sessionStorage.getItem("r1Score") > 0){
    alert("You have successfully completed Round-1.");
    window.location = "index.html";
}else if(!sessionStorage.getItem("startTime")){
    alert("Are you kidding?");
    window.location = "index.html";
}
else{
    // alert("<0 not completed");
    loadRandomNos();
}

function loadRandomNos(){
    // alert("call");
    generated = [];//how many question display generate according <=2 means 3 ques displayed 0 1 2
    while(generated.length <= 19){
        var random = Math.floor(Math.random() * 130) + 1; //total 130 ques ini DB so generate between 1 to 130
        if(generated.includes(random)){
            random = Math.floor(Math.random() * 130) + 1;
        }else{
            generated.push(random);
        } 
    }
    // console.log("random nos loaded---"+generated);
    if(!sessionStorage.getItem("iValue")){
        i=0;
    }else{
        i = sessionStorage.getItem("iValue");
    }
    // if(!sessionStorage.getItem("scoreValue")){
        score = 0;
    // }else{
    //     score = sessionStorage.getItem("scoreValue");
    // }
    
    finalAns1 = "";
    trueAns1 = "";
    loadQues(generated);
}

function setUserAns1(){
    // console.log("1");
    finalAns1 = "";
    finalAns1 = document.getElementById("ans1").innerHTML; 
}
function setUserAns2(){
    // console.log("2");
    finalAns1 = "";
    finalAns1 = document.getElementById("ans2").innerHTML; 
}
function setUserAns3(){
    // console.log("3");
    finalAns1 = "";
    finalAns1 = document.getElementById("ans3").innerHTML; 
}
function setUserAns4(){
    // console.log("4");
    finalAns1 = "";
    finalAns1 = document.getElementById("ans4").innerHTML; 
}

function loadQues(generated){
    
    if(i < generated.length){
        // console.log(i+"---"+generated.length);

        firebase.database().ref('rnd1/' + generated[i]).on('value', function(snapshot){

            if(snapshot.val()){
                // console.log("ques found");
                document.getElementById("spinner1").style.display = "none";
                document.getElementById("QandA").style.display = "block";
                document.getElementById("topSvg").style.display = "block";
                document.getElementById("ques").innerHTML = snapshot.val().ques;
                document.getElementById("ans1").innerHTML = snapshot.val().ans1;
                document.getElementById("ans2").innerHTML = snapshot.val().ans2;
                document.getElementById("ans3").innerHTML = snapshot.val().ans3;
                document.getElementById("ans4").innerHTML = snapshot.val().ans4;
                document.getElementById("quesNo").innerHTML = "Question-" + i + "/" + generated.length;
                document.getElementById("myNext").style.display = "block";
                document.getElementById("bottomSvg").style.display = "block";
                
                if(i == generated.length){
                    // alert("over");
                    document.getElementById("myNext").style.display = "none";
                    document.getElementById("mySubmit").style.display = "block";
                }
                trueAns1 = snapshot.val().trueAns; 
            }else{
                document.getElementById("myNext").style.display = "block";
                alert("Question not found");
                // console.log("Question not found click next");
            }
        });

        document.getElementById("myNext").style.display = "block";
    }
    else if(i == generated.length){
        // console.log(i+"--EQ--"+generated.length);
        document.getElementById("myNext").style.display = "none";
        document.getElementById("mySubmit").style.display = "block";
    }
    sessionStorage.setItem("iValue",i);
    i++;

    if((finalAns1 == trueAns1) && (finalAns1 != "")){
        score++;
        // sessionStorage.setItem("scoreValue",score);
        console.log("true---"+score);
    }else{
        console.log("wrong---"+score);
    }
}

function fun1(){
    quizTime = setTimeout(function(){
        alert("Time Over");
        scoreCheck_SubmitPress(finalAns1, trueAns1);
    }, 180000);
}
function scoreCheck_SubmitPress(finalAns1, trueAns1){
    clearTimeout(quizTime);
    // alert("call");
    if((finalAns1 == trueAns1) && (!finalAns1)){
        score++;
        // console.log("trueSub---"+score);
    }
    // else{
    //     console.log("wrongSub---"+score);
    // }   
    // alert("updated score---"+score);

    var endTime1 = new Date();
    timeTaken1 = Math.abs( endTime1-(Date.parse(sessionStorage.getItem("startTime"))) ) / 1000;
    sessionStorage.setItem("finalTime", timeTaken1);
    // alert("start time = "+sessionStorage.getItem("startTime")+"--end time = "+endTime1+"--final time = "+timeTaken1);

    var split1 = sessionStorage.getItem("splittedGmail");
    var database = firebase.database();
    firebase.database().ref('usr1/' + split1).update({
        r1Score: (score+1), // +1 shows => attended rnd1 by user
        timeTaken: timeTaken1
    });
    // console.log("updated--"+score);
    sessionStorage.setItem("r1Score",(score+1));
    sessionStorage.removeItem("startTime");
    alert("Round-1 is completed successfully.");

    setTimeout(function(){
        window.location = "index.html";
    }, 1500);
}