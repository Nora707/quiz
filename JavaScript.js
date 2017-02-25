// create global  object for userData
var userObject = {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "education": "",
    "englishLevel": "",
    "age": "",
    "newsLetter": ""
};

// collect the data from imput and send the validated data to the server
function inputUserData() {
    var firstName = document.querySelector('#firstName').value;
    var lastName = document.querySelector('#lastName').value;
    var email = document.querySelector('#emailFirstPart').value + "@" + document.querySelector('#emailSecondPart').value;
    var phone = document.querySelector('#phone').value;
    var education = document.querySelector('input[name=education]:checked').value;
    var englishLevel = document.querySelector('input[name=englishLevel]:checked').value;
    var age = document.querySelector('input[name=age]:checked').value;
    var newsLetter = document.querySelector('input[name=newsLetter]').checked;

    //add the value to the object
    userObject.firstName = firstName;
    userObject.lastName = lastName;
    userObject.email = email;
    userObject.phone = phone;
    userObject.education = education;
    userObject.englishLevel = englishLevel;
    userObject.age = age;
    //validate the check box status
    if (newsLetter == true) {
        userObject.newsLetter = "on";
    };
    //post the data to te server and change the button text if it susses
        $.post("https://yellowroad.training360.com/registration", userObject, function (res) {
            console.log(res);
            var response = res;
            var successSubmit = document.querySelector('#submit');
			var quizButton = document.querySelector('#quiz');
            if (response.success == true) {
                successSubmit.value = "Sikeres regisztráció";
                successSubmit.disabled = true; //disable the buttun to avoid repeated registration
				successSubmit.style.marginLeft = "0";
				quizButton.style.display = "block";
            }
        });
    
        return false;
}

/*function startQuiz(){
	$.post( "quiz.html", function( email ) {
		console.log(email);
	});
} */


