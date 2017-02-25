

var counter=0; //keeps track of questions
var forwardBtn=document.getElementById('next');
/* var usersAllA=[]; */
var userData=[];
	/*Defining global variables to save name and email*/
var name = ''; //KELL E NEKÜNK A NÉV? KI AKARJUK ÍRNI VALAHOVA?
var email = '';
/* var userPoints=0; */

var emailBox=document.querySelector('#email');
var emalValBTn=document.getElementById('emailVal');
var endBtn=document.getElementById('end');
var quizStartingBtn=document.getElementById('quiz');
var regBtn=document.getElementById('reg');
var resultBtn= document.querySelector("#resultPercent");
var set=[];
var currentset;
var allRadio=document.querySelectorAll('[name="ans"]');
var myresultId;

$.getJSON('http://quiz.nettuts.hu/quiz/scriptonit/', function(dataB) {
  set=dataB;
  //console.log(set);
});

 
window.onload=checkEmail();
endBtn.addEventListener('click', goToResult);
quizStartingBtn.addEventListener('click', showNextSet);

function checkEmail(){
	/*Saving the email from the url, straing point*/
		var urlChecker = /\?.*email\=([^\&\#]*)/;
		var savedInfo = location.href.match(urlChecker);
		
			/* !! is not null  */
		if(!!savedInfo ){
			var savedUrlEmail = savedInfo[1];
			emailBox.value=decodeURIComponent(savedUrlEmail);
			gettingData(savedUrlEmail);
				/* the button bring up the quiz*/
			forwardBtn.addEventListener('click', twoFunction);
			document.querySelector('.hideP').style.display="block";
		}else{
			emailBox.removeAttribute('disabled');	
				/* the button checks the database for the newly input email*/
			emalValBTn.addEventListener('click', checkNewEmail);
			
		}
		//console.log(savedUrlEmail);
		gettingData(savedUrlEmail);// EZ KELL KÉTSZER? ITT ÉS A IF-BEN
}	



	/*Checking the email in the database - saving name and email*/
function gettingData(savedUrlEmail){
	$.getJSON('http://quiz.nettuts.hu/quiz/scriptonit/checkuser?email=' + savedUrlEmail, function (data) {
		console.log(data);
		userData=data;
		if (data.length>0) {
			name = data[0].lastname;
			email = data[0].email;
			//console.log('email: '+email);
		}
		
	});
}

function checkNewEmail(e){
	e.preventDefault();
	var newEmail=emailBox.value;
	//console.log(userData);
		$.getJSON('http://quiz.nettuts.hu/quiz/scriptonit/checkuser?email=' + newEmail, function (data) {
		console.log(data);
		userData=data;

		if(userData.length==0){
			console.log('nem létező felhasználó');
			regBtn.style.display="block";
			quizStartingBtn.style.display="none";
			document.querySelector('.hideP').style.display="block";
			document.querySelector('.hideP').innerHTML="Nincs ilyen e-mail címmel rendelkező felhasználó a rendszerünkben. Ellneőrizd, hogy jól írtad-e be. Ha még nem regsiztráltál, az alább látható gombbal megteheted.";
			quizStartingBtn.style.display="none";
			
		}else{
			console.log('1');
			location.href+='?email='+newEmail;
			console.log('2');
			document.querySelector('.hideP').style.display="block";
		}
	});

}

function twoFunction(){
	sendDataAfterCklick();
}

function showNextSet(){
	document.querySelector('[method="post"]').children[0].style.display="none";
	document.querySelector('[method="post"]').children[2].style.display="none";
	quizStartingBtn.style.display="none";
	forwardBtn.style.display="block";
	document.querySelector(".hideD").style.display="block";
	document.querySelector(".hideP").style.display="none";
	var questionBox=document.querySelector('.questionName');
	var answerBox0=document.querySelector('#ansWord0');
	var answerBox1=document.querySelector('#ansWord1');
	var answerBox2=document.querySelector('#ansWord2');
	var ans0Radio=document.getElementById('ans0');
	var ans1Radio=document.getElementById('ans1');
	var ans2Radio=document.getElementById('ans2');
	
		currentset=set[counter];
		console.log('counter '+counter);
		questionBox.innerHTML=currentset.question;
		answerBox0.innerHTML=currentset.answer;
		answerBox1.innerHTML=set[counter+1].answer;
		answerBox2.innerHTML=set[counter+2].answer;
}

function sendDataAfterCklick(){
	var userAnswer={
		answerId:'' ,
		questionId: '',
		registrationId:''
	}
	var checkedRadio='';
	
	for (var i=0; i< allRadio.length; i++){
		if (allRadio[i].checked==true){
			checkedRadio=allRadio[i].value;
		}
	}
	
	switch (checkedRadio){
		case 'a': checkedRadio=currentset.answerId
		break;
		case 'b': checkedRadio=set[counter+1].answerId;
		break;
		case 'c': checkedRadio=set[counter+2].answerId;
		break;
	}

	userAnswer.answerId=checkedRadio;
	userAnswer.questionId=currentset.questionId;
	userAnswer.registrationId=userData[0].registrationId;
	console.info(userAnswer);
	counter+=3;
	
	$.post('http://quiz.nettuts.hu/quiz/scriptonit/answer', userAnswer, function(res){
		console.log(res);
		myresultId=res[0].resultId;
		//console.log(myresultId);
	});
	//console.log(questionBox);
	//console.log('counter: '+counter);
/* 	if(usersAllA.length==12){
	console.log(usersAllA);
	} */
	
	if(counter<36){
	showNextSet();
	}else if(counter==36){
		forwardBtn.style.display="none";
		endBtn.style.display="block";
	}
}
 
function goToResult(){
	$.getJSON('http://quiz.nettuts.hu/quiz/scriptonit/result/'+myresultId, function(res){
		//console.log(res);
		
		resultBtn.classList.add('showResultInBig');
		document.querySelector(".hideD").style.display="none";
		var percent=res[0].result;
		resultBtn.style.display="block"
		var persentResult = Math.floor(percent*100)
		if (persentResult < 60){
			resultBtn.style.backgroundColor= "red";
			resultBtn.innerHTML="Eredményem:"+persentResult+"%";
		}
		else{
			resultBtn.style.backgroundColor= "green";
			resultBtn.innerHTML="Eredményem:"+persentResult+"%";
		}
		endBtn.style.display="none";
	});
}