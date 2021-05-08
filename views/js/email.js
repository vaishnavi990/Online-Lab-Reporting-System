function handleInput(){
    var value = document.getElementById('email_id').value;
    var text = document.getElementById('text');
    const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if(emailRegex.test(value.trim())){
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