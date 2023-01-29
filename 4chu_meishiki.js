
document.addEventListener('DOMContentLoaded', function() {
    readCookie();
});


function readCookie(){
    let cookie_data = document.cookie.split('_');
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

    let element_name = document.getElementById("username");
    if(username == ""){
        element_name.innerHTML = "匿名";
    }else{
        element_name.innerHTML = username;
    }

    let birthtext = "";
    let element_birthday = document.getElementById("birthday");
    birthtext += year + " 年　" + month + " 月　" + day + " 日　　";

    let element_birthtime = document.getElementById("birthtime");
    if(day == "" || minute == ""){
        birthtext += "出生時刻　不明";
    }else{
        birthtext += "出生時刻　" + time + " 時  " + minute + " 分";
    }

    element_birthtime.innerHTML = birthtext;

}

var KAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
var SHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
var ROKUJU_KANSHI = [];
for(i = 0; i < 60; i++){
    ROKUJU_KANSHI.push([i % 10, j % 12]);
}
var tsuhensei = ["比肩", "劫財", "食神", "傷官", "正財", "偏財", "正官", "偏官", "正印", "偏印"];

function is_fushiiri(year, month, day){
    let csv = new XMLHttpRequest();
    csv.open("GET", "sekki_24_simplified.csv");
    lines = csv.responseText.split(/\r\n|\n/);
    let fushiiri = [];
    for(let i = 0; i < lines.length; ++i){
        fushiiri.push(line[i]);
    }

    let date = new Date(year, month, day, 12, 0);

    for(let i = 0; i < fushiiri.length; i += 0){
        let fushiiri_date = new Date(fushiiri[i][0], fushiiri[i][1], fushiiri[i][2], 12, 0);
        if((date.getFullYear() == fushiiri_date.getFullYear())
        && (date.getMonth() == fushiiri_date.getMonth())){
            if(date < fushiiri_date){
                return 0;
            }else{
                return 1;
            }
        }
    }
    alert("エラー：節入り計算");
}

function nen_kanshi(){

}

function getsu_kanshi(){

}

function nichi_kanshi(){

}

function ji_kanshi(){
    
}