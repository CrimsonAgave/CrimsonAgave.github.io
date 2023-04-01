

function maleClick(){
    if(female.checked){
        female.checked = false;
    }
}

function femaleClick(){
    if(male.checked){
        male.checked = false;
    }
}

function make_meishiki(){
    var confirmed = false;

    if(!(male.checked) && !(female.checked)){
        alert("性別を入力してください");
    }else if(year.value == "" || month.value == "" || day.value == ""){
        alert("生年月日を入力してください");
    }else if(isNaN(year.value) || isNaN(month.value) || isNaN(day.value)){
        alert("適切な生年月日を入力してください");
    }else{
        let user_birthday = year.value + "/" + month.value + "/" + day.value;
        let date = new Date(user_birthday);
    
        if(isNaN(date.getDate()) || !(1 <= month.value && month.value <= 12) || !(1 <= day.value && day.value <= 31)){
            alert("適切な生年月日を入力してください");
        }else if(!(1851 <= Number(year.value) && Number(year.value) <= 2050)){
            alert("本サイトで命式を作成できるのは1851年から2050年までです");
        }else if((hour.value < 0 || 23 <hour.value) || (minute.value < 0 || 59 < minute.value)){
            alert("適切な出生時刻を入力してください")
        }else{
            confirmed = true;
        }

    }

    var days = null;
    if(days){
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires=" +date.toGMTString();
    }else{
        var expires = "";
    }

    return confirmed;   
}
