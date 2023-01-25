document.addEventListener('DOMContentLoaded', function() {
    readCookie();
});


function readCookie(){
    var cookie_data = document.cookie.split('_');
    if(cookie_data[0] != 0 && cookie_data[0] != 1){
        alert("エラーが発生しました。元のページに戻ります。");
        location.href = "4chu.html";
    }
    
    sex = cookie_data[0];
    username = cookie_data[1];
    year = cookie_data[2];
    month = cookie_data[3];
    day = cookie_data[4];
    time = cookie_data[5];
    minute = cookie_data[6];
    birthplace = cookie_data[7];

    var element_name = document.getElementById("username");
    if(username == ""){
        element_name.innerHTML = "匿名";
    }else{
        element_name.innerHTML = username;
    }

    var birthtext = "";
    var element_birthday = document.getElementById("birthday");
    birthtext += year + " 年　" + month + " 月　" + day + " 日　　";

    var element_birthtime = document.getElementById("birthtime");
    if(day == "" || minute == ""){
        birthtext += "出生時刻　不明";
    }else{
        birthtext += "出生時刻　" + time + " 時  " + minute + " 分";
    }

    element_birthtime.innerHTML = birthtext;


}


