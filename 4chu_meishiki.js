
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
    if(time == "" || minute == ""){
        birthtext += "出生時刻　不明";
        time = -1;
        minute = -1; 
    }else{
        birthtext += "出生時刻　" + time + " 時  " + minute + " 分";
    }

    element_birthtime.innerHTML = birthtext;


    meishiki = kanshi(year, month, day, time, minute);
}

var KAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
var SHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
var ROKUJU_KANSHI = [];
for(i = 0; i < 60; i++){
    ROKUJU_KANSHI.push([i % 10, i % 12]);
}
var GETSU_KANSHI = [];
for(i = 0; i < 10; i++){
    GETSU_KANSHI.push([])
    for(j = 0; j < 12; j++){
        GETSU_KANSHI[i].push((2 * (i + 1) + 1) % 10 - 1, j);
    }
}
var tsuhensei = ["比肩", "劫財", "食神", "傷官", "正財", "偏財", "正官", "偏官", "正印", "偏印"];


function is_setsuiri(year, month, day, time, minute){
    let date = new Date(year, month, day, time, minute);
    if(time == -1 || minute == -1){
        let date = new Date(year, month, day, 12, 0);        
    }

    let csv = new XMLHttpRequest();
    csv.open("GET", "sekki_24_simplified.csv", true);

    let tmp = csv.responseText.split("\n");


    for (let i = 0; i < tmp.length; i++) {
        let line = tmp[i].split(",");
        alert(line);
        break;

        let setsuiri_date = new Date(line[0], line[1], line[2], line[3], line[4], line[5]);
        if((date.getFullYear() == setsuiri_date.getFullYear()) && (date.getMonth() == setsuiri_date.getMonth())){
            if(date > setsuiri_date){
                return 0;
            }else{
                return 1;
            }
        }
    }
    alert("エラー：節入り計算");
}

function kanshi(year, month, day, time, minute){
    let date = new Date(year, month, day, 12, 0);

    let kanshi_idx = (year - 3) % 60 - 2;
    let ritshun_date = new Date(year, 2, 4, 12, 0);
    if(ritshun_date <= date){
        kanshi_idx += 1;
    }
    nen_kanshi_idx = ROKUJU_KANSHI.slice(kanshi_idx)[0];
    nenkan = KAN.slice(nen_kanshi_idx[0])[0];
    nenshi = SHI.slice(nen_kanshi_idx[1])[0];    

    let i = is_setsuiri(year, month, day, time, minute);

    let gekkan = "不明";
    let getshi = "不明";

    let nikkan = "不明";
    let nitshi = "不明"

    jikan = "不明";
    jishi = "不明";
    meishiki = [[nenkan, nenshi], [gekkan, getshi], [nikkan, nitshi], [jikan, jishi]];
    alert(meishiki);

    return meishiki;
}