document.addEventListener('DOMContentLoaded', function() {
    readCookie();
});


function readCookie(){
    var cookie_data = document.cookie.split('_');
    if(cookie_data[0] != 0 && cookie_data[0] != 1){
        alert("エラーが発生しました。元のページに戻ります。");
        location.href = "4chu.html";
    }
    
}

