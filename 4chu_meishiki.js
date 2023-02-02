
var KAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
var SHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
var ROKUJU_KANSHI = [];
for(i = 0; i < 60; i++){
    ROKUJU_KANSHI.push([i % 10, i % 12]);
}
var GETSU_KANSHI = [];
for(i = 0; i < 5; i++){
    GETSU_KANSHI.push([])
    for(j = 0; j < 12; j++){
        kan = j + (2 * i + 3);
        if(j >= 1){ kan -= 2; }
        kan %= 10;
        GETSU_KANSHI[i].push([kan, (j + 1) % 12]);
    }
}
var SETSUIRI_LIST = ["小寒", "立春", "啓蟄", "清明", "立夏", "芒種",
                     "小暑", "立秋", "白露", "寒露", "立冬", "大雪"];
var JI_KANSHI = [];
for(i = 0; i < 5; i++){
    JI_KANSHI.push([])
    for(j = 0; j < 13; j++){
        JI_KANSHI[i].push([(2 * i + j) % 10, j % 12]);
    }
}
console.log(JI_KANSHI);
var TSUHENSEI = ["比肩", "劫財", "食神", "傷官", "正財", "偏財", "正官", "偏官", "正印", "偏印"];




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

    let birth_text = "生年月日時：　";
    let element_birthday = document.getElementById("birthday");
    birth_text += year + " 年 " + month + " 月 " + day + " 日　";

    let element_birthtime = document.getElementById("birthtime");
    if(time == "" || minute == ""){
        birth_text += "時刻：不明";
        time = 0;
        minute = 0; 
    }else{
        birth_text += "時刻：" + time + " 時 " + minute + " 分";
    }

    element_birthtime.innerHTML = birth_text;

    meishiki = kanshi(year, month, day, time, minute);
}


function convertCSVtoArray(csv){
    let result = [];
    let tmp = csv.split("\n");
    
    for(i = 0; i < tmp.length; i++){
        if(tmp[i] != ""){
            result[i] = tmp[i].split(",");
        }
    }
    return result;
}

function kanshi(year, month, day, time, minute){
    let result = -1;
    let date = new Date(year, month, day, time, minute);
    if(time == -1 || minute == -1){
        let date = new Date(year, month, day, 0, 0);        
    }

    let request = new XMLHttpRequest();
    request.open("get", "sekki_24_simplified.csv", true);
    request.send(null);
    request.onload = function(){
        let data = convertCSVtoArray(request.responseText);
        for (let i = 0; i < data.length; i++) {  
            let setsuiri_date = new Date(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]);
            if((date.getFullYear() == setsuiri_date.getFullYear()) && (date.getMonth() == setsuiri_date.getMonth())){
                if(date > setsuiri_date){
                    result =  0;
                }else{
                    result =  1;
                }
            }
        }

        let birth_date = new Date(year, month-1, day, time, minute); 

        let nenkanshi_idx = make_nenkanshi(birth_date, data);
        let nenkan = KAN.slice(nenkanshi_idx[0])[0];
        let nenshi = SHI.slice(nenkanshi_idx[1])[0];  

        let getsukanshi_idx = make_getsukanshi(birth_date, data, nenkanshi_idx);
        let gekkan = KAN.slice(getsukanshi_idx[0])[0];
        let getshi = SHI.slice(getsukanshi_idx[1])[0];  
    
        let nikkanshi_idx = make_nikkanshi(birth_date, data);
        let nikkan = KAN.slice(nikkanshi_idx[0])[0];
        let nitshi = SHI.slice(nikkanshi_idx[1])[0]; 

        let jikanshi_idx = make_jikanshi(birth_date, data, nikkanshi_idx);
        let jikan = KAN.slice(jikanshi_idx[0])[0];
        let jishi = SHI.slice(jikanshi_idx[1])[0]; 

        meishiki = [[nenkan, nenshi], [gekkan, getshi], [nikkan, nitshi], [jikan, jishi]];
        alert(meishiki);
    }
}

function make_nenkanshi(birth_date, data_setsuiri){
    let kanshi_idx = (Number(birth_date.getFullYear()) - 3) % 60 - 2;

    let check_error = true;
    for(i = 0; i < data_setsuiri.length; i++){
        if((Number(data_setsuiri[i][0]) == birth_date.getFullYear()) && (Number(data_setsuiri[i][1]) == 2)){
            let ritshun_date = new Date(data_setsuiri[i][0], data_setsuiri[i][1], data_setsuiri[i][2], data_setsuiri[i][3], data_setsuiri[i][4]);
            if(ritshun_date <= birth_date){
                kanshi_idx += 1;
            }
            check_error = false;
        }
    }
    if(check_error){
        alert("エラー：年干支計算");
    }

    let nenkanshi_idx = ROKUJU_KANSHI.slice(kanshi_idx)[0];
    return nenkanshi_idx;  
}


function make_getsukanshi(birth_date, data_setsuiri, nenkanshi_idx){
    let kan_idx = ((nenkanshi_idx[0]) % 10) % 5;
    let shi_idx = (birth_date.getMonth() - 1) % 12;
    if(shi_idx < 0){ shi_idx += 12; }


    let check_error = true;
    for(i = 0; i < data_setsuiri.length; i++){
        if((Number(data_setsuiri[i][0]) == birth_date.getFullYear()) 
        && (Number(data_setsuiri[i][1]) == birth_date.getMonth() + 1)){
            let setsuiri_date = new Date(data_setsuiri[i][0], data_setsuiri[i][1] - 1, data_setsuiri[i][2], data_setsuiri[i][3], data_setsuiri[i][4]);
            if(setsuiri_date <= birth_date){
                shi_idx = (shi_idx + 1) % 12;
            }

            let setsuiri_text = "節入り：" + SETSUIRI_LIST[setsuiri_date.getMonth()] + "　" + setsuiri_date.getFullYear() + "年 " 
                            + String(setsuiri_date.getMonth() + 1) + " 月 " + setsuiri_date.getDate() + " 日　" 
                            + "時刻：" + setsuiri_date.getHours() + " 時 " + setsuiri_date.getMinutes() + " 分 ";
            let element_setsuiri = document.getElementById("setsuiri");
            element_setsuiri.innerHTML = setsuiri_text;
        
            check_error = false;
        }
    }
    if(check_error){
        alert("エラー：月干支計算");
    }

    let getsukanshi_idx = GETSU_KANSHI[kan_idx][shi_idx];
    return getsukanshi_idx;
}

function make_nikkanshi(birth_date, data_setsuiri){
    criterion = new Date(1850, 1, 1, 0, 0);           // 丙寅: 2
    nissu = (birth_date - criterion) / 86400000;
    nikkanshi_idx = Math.floor((nissu　+ 20) % 60) - 1;

    // 時間と緯軽度の関係は未実装

    kan_idx = nikkanshi_idx % 10;
    shi_idx = nikkanshi_idx % 12;
    return [kan_idx, shi_idx];
}

function make_jikanshi(birth_date, data_setsuiri, nikkannshi_idx){
    let kan_idx = nikkannshi_idx[0] % 5;
    let shi_idx = Math.floor((birth_date.getHours() + 1) / 2);

    // 時間と緯軽度の関係は未実装
    // 

    let jikanshi_idx = JI_KANSHI[kan_idx][shi_idx];
    return jikanshi_idx;
}
