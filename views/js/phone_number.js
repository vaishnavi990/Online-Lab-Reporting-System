function validate(){
    const number = /^[6-9]\d{8}$/;
    var text = document.getElementById('phone_text');
    var value = document.getElementById('mobile_no').value;
    if(number.test(value)){
        text.innerHTML="Valid Email ID";
        text.style.color="#00ff00";
    }
    else{
        text.innerHTML="Invalid Email ID";
        text.style.color="#ff0000";
    }
    if(!value){
        text.innerHTML="Invalid Email ID";
    }

}