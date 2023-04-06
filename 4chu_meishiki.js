
const KAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const SHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZOKAN = ["壬癸", "癸辛己", "戊丙甲", "甲乙", "乙癸戊", "戊庚丙", "丙丁", "丁乙己", "戊壬庚", "庚辛", "辛丁戊", "戊甲壬"];
var ROKUJU_KANSHI = [];
for(i = 0; i < 60; i++){
    ROKUJU_KANSHI.push([i % 10, i % 12]);
}
var ROKUJU_KANSHI_str = []
for(i = 0; i < 60; i++){
    ROKUJU_KANSHI_str.push(KAN[i % 10] + SHI[i % 12]);
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
const SETSUIRI_LIST = ["小寒", "立春", "啓蟄", "清明", "立夏", "芒種",
                     "小暑", "立秋", "白露", "寒露", "立冬", "大雪"];
var JI_KANSHI = [];
for(i = 0; i < 5; i++){
    JI_KANSHI.push([])
    for(j = 0; j < 12; j++){
        JI_KANSHI[i].push([(2 * i + j) % 10, j % 12]);
    }
}
for(let i = 0; i < 5; i++){
    JI_KANSHI[i].push(JI_KANSHI[i][0]);
}

const GOGYO_COLOR = ["#A4D2Bf", "#D79CA7", "#D6D29E", "#B8B8B8", "#909090"] 


document.addEventListener('DOMContentLoaded', function() {
    readPage();
});

function readPage(){
    const url = new URL(window.location.href);
    const parameters = url.searchParams;
    let sex = -1;
    let male = parameters.get("male");
    let female = parameters.get("female");
    if(female == "on"){ sex = "0";}
    if(male == "on"){ sex = "1"; }
    let username = parameters.get("username");
    let year = parameters.get("year");
    let month = parameters.get("month");
    let day = parameters.get("day");
    let time = parameters.get("hour");
    let minute = parameters.get("minute");
    let birthplace = parameters.get("todohuken")

    


    let now_date = new Date();
    let birth_date = new Date(now_date.getFullYear(), month, day)

    let user_title = "";
    let element_name = document.getElementById("username");
    if(username == ""){
        user_title += "匿名";
    }else{
        user_title += username;
    }
    if(sex == 1){
        user_title += "<br>男　"
    }else{
        user_title += "<br>女　"
    }
    if(now_date > birth_date){
        user_title += now_date.getFullYear() - year + "歳"
    }else{
        user_title += now_date.getFullYear() - year - 1 + "歳"
    }
    element_name.innerHTML = user_title;

    let birth_text = "生年月日：　";
    birth_text += year + " 年 " + month + " 月 " + day + " 日　";
    let element_birthtime = document.getElementById("birthtime");
    if(time == "" || minute == ""){
        birth_text += "時刻：不明";
        time = 0;
        minute = 0; 
        have_jikanshi = false;
    }else{
        birth_text += "時刻：" + time + " 時 " + minute + " 分";
        have_jikanshi = true;    
    }

    element_birthtime.innerHTML = birth_text;


    meishiki = kanshi(sex, year, month, day, time, minute, birthplace, have_jikanshi);
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

function kanshi(sex, year, month, day, time, minute, prefecture, have_jikanshi){
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
    
        let nikkanshi_idx = make_nikkanshi(birth_date, prefecture);
        let nikkan = KAN.slice(nikkanshi_idx[0])[0];
        let nitshi = SHI.slice(nikkanshi_idx[1])[0]; 

        let jikan = "不明";
        let jishi = "不明";
        if(have_jikanshi == true){
            let jikanshi_idx = make_jikanshi(birth_date, nikkanshi_idx, prefecture);
            jikan = KAN.slice(jikanshi_idx[0])[0];
            jishi = SHI.slice(jikanshi_idx[1])[0];     
        }else{
            let element_birthplace = document.getElementById("birth_prefecture");
            if(prefecture == "不明"){
                birthplace_text = "出生地：不明"
                prefecture = "兵庫県";
            }else{
                birthplace_text = "出生地：" + prefecture;
            }
            element_birthplace.innerHTML = birthplace_text;
        }

        meishiki = [[jikan, jishi], [nikkan, nitshi], [gekkan, getshi], [nenkan, nenshi]];
        display_meishiki(meishiki);
        make_tsuhensei(meishiki);
        make_daiun(meishiki, sex, birth_date, data)
        make_ryuun(birth_date, result);
        count_gogyo(meishiki);
        make_zokan(meishiki);
        make_gochukei(meishiki);
    }
}

function make_nenkanshi(birth_date, data_setsuiri){
    let kanshi_idx = (Number(birth_date.getFullYear()) - 3) % 60 - 2;

    let check_error = true;
    for(i = 0; i < data_setsuiri.length; i++){
        if((Number(data_setsuiri[i][0]) == birth_date.getFullYear()) && (Number(data_setsuiri[i][1]) == 2)){
            let ritshun_date = new Date(data_setsuiri[i][0], data_setsuiri[i][1] - 1, data_setsuiri[i][2], data_setsuiri[i][3], data_setsuiri[i][4]);
            if(ritshun_date <= birth_date){
                kanshi_idx += 1;
            }
            check_error = false;
        }
    }
    if(check_error){
        alert("エラー：年干支計算");
        location.href = "4chu.html";
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

            let setsuiri_text = "節入り：" + SETSUIRI_LIST[setsuiri_date.getMonth()] + "　" + setsuiri_date.getFullYear() + " 年 " 
                            + String(setsuiri_date.getMonth() + 1) + " 月 " + setsuiri_date.getDate() + " 日　" 
                            + "時刻：" + setsuiri_date.getHours() + " 時 " + setsuiri_date.getMinutes() + " 分 ";
            let element_setsuiri = document.getElementById("setsuiri");
            element_setsuiri.innerHTML = setsuiri_text;
        
            check_error = false;
        }
    }
    if(check_error){
        alert("エラー：月干支計算");
        location.href = "4chu.html";
    }

    let getsukanshi_idx = GETSU_KANSHI[kan_idx][shi_idx];
    return getsukanshi_idx;
}

var Prefectures_name = ["北海道","青森県","岩手県","宮城県","秋田県",
                        "山形県","福島県","茨城県","栃木県","群馬県",
                        "埼玉県","千葉県","東京都","神奈川県","新潟県",
                        "富山県","石川県","福井県","山梨県","長野県",
                        "岐阜県","静岡県","愛知県","三重県","滋賀県",
                        "京都府","大阪府","兵庫県","奈良県","和歌山県",
                        "鳥取県","島根県","岡山県","広島県","山口県",
                        "徳島県","香川県","愛媛県","高知県","福岡県",
                        "佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

var Prefectures_x = [141.347899,140.740593,141.152667,140.872103,140.102334,
                    140.363634,140.467521,140.446793,139.883565,139.060156,
                    139.648933,140.123308,139.691704,139.642514,139.023221,
                    137.211338,136.625573,136.221642,138.568449,138.181224,
                    136.722291,138.383054,136.906565,136.508591,135.86859,
                    135.755608,135.519711,135.183025,135.832744,135.167506,
                    134.237672,133.050499,133.934675,132.459622,131.4705,
                    134.559303,134.043444,132.765362,133.53108,130.418314,
                    130.298822,129.873756,130.741667,131.612591,131.423855,130.557981,127.680932];


function make_nikkanshi(birth_date, prefecture){
    let criterion = new Date(1970, 1, 1, 12, 0); 
    let gyap_y = (birth_date.getFullYear() - criterion.getFullYear());
    let gyap_md = 0
    for(let i = 1; birth_date.getMonth() >= i; i++){
        gyap_md += new Date(birth_date.getFullYear(), i, 0).getDate();
    }
    gyap_md += birth_date.getDate();
    let gyap_d = 365 * gyap_y + Math.floor((gyap_y - 3) / 4) + gyap_md;
    let nikkanshi_idx = (gyap_d + 17) % 60
    if(nikkanshi_idx < 0){
        nikkanshi_idx += 60;
    }

    // 時差
    if(prefecture == "不明"){
        jisa_minutes = 0;
    }else{
        let Prefecture_idx = Prefectures_name.indexOf(prefecture);
        let longitude = Prefectures_x[Prefecture_idx];
        jisa_minutes = Math.round((longitude - 135) * 4);    
    }
    let time = birth_date.getHours();

    if(birth_date.getMinutes() + jisa_minutes >= 60){
        time += 1
    }else if(birth_date.getMinutes() + jisa_minutes < 0){
        time -= 1
    }

    if(time >= 23){
        nikkanshi_idx = nikkanshi_idx + 1;
    }

    if(nikkanshi_idx < 0){
        nikkanshi_idx = 59;
    }

    kan_idx = nikkanshi_idx % 10;
    shi_idx = nikkanshi_idx % 12;
    return [kan_idx, shi_idx];
}

function make_jikanshi(birth_date, nikkannshi_idx, prefecture){
    // 時差
    let Prefecture_idx = Prefectures_name.indexOf(prefecture);
    if(prefecture == "不明"){
        jisa_minutes = 0;
    }else{
        let longitude = Prefectures_x[Prefecture_idx];
        jisa_minutes = Math.round((longitude - 135) * 4);    
    }

    let time = 0;
    if(birth_date.getMinutes() + jisa_minutes >= 60){
        time = (birth_date.getHours() + 1 + 1);
        if(time >= 24){ time %= 24; }
    }else if(birth_date.getMinutes() + jisa_minutes < 0){
        time = (birth_date.getHours() + 1 - 1);
        if(time <= 0){ time = time + 24; }
    }else{
        time = (birth_date.getHours() + 1);
    }
    let shi_idx = Math.floor(time / 2);    
    let kan_idx = nikkannshi_idx[0] % 5;


    // 表示
    let element_birthplace = document.getElementById("birth_prefecture");
    if(prefecture == "不明"){
        birthplace_text = "出生地：不明"
        prefecture = "兵庫県";
        jisa_minutes = 0;
    }else{
        birthplace_text = "出生地：" + prefecture;
    }    
    element_birthplace.innerHTML = birthplace_text + "（時差 " + jisa_minutes + "分）";

    let jikanshi_idx = JI_KANSHI[kan_idx][shi_idx];
    return jikanshi_idx;
}

function display_meishiki(meishiki){
    if(KAN.includes(meishiki[0][0])){
        document.getElementById("jikan").src = "css/" + meishiki[0][0] + ".png";
    }else{
        document.getElementById("jikan").src = "css/" + "不明" + ".png";
    }
    if(SHI.includes(meishiki[0][1])){
        document.getElementById("jishi").src = "css/" + meishiki[0][1] + ".png";
    }else{
        document.getElementById("jishi").src = "css/" + "不明" + ".png";
    }

    if(KAN.includes(meishiki[1][0])){
        document.getElementById("nikkan").src = "css/" + meishiki[1][0] + ".png";
    }
    if(SHI.includes(meishiki[1][1])){
        document.getElementById("nisshi").src = "css/" + meishiki[1][1] + ".png";
    }
    if(KAN.includes(meishiki[2][0])){
        document.getElementById("gekkan").src = "css/" + meishiki[2][0] + ".png";
    }
    if(SHI.includes(meishiki[2][1])){
        document.getElementById("gesshi").src = "css/" + meishiki[2][1] + ".png";
    }
    if(KAN.includes(meishiki[3][0])){
        document.getElementById("nenkan").src = "css/" + meishiki[3][0] + ".png";
    }
    if(SHI.includes(meishiki[3][1])){
        document.getElementById("nenshi").src = "css/" + meishiki[3][1] + ".png";
    }
}

var TSUHENSEI_MATRIX   = [  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                            [1, 0, 3, 2, 5, 4, 7, 6, 9, 8],
                            [8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
                            [9, 8, 1, 0, 3, 2, 5, 4, 7, 6],
                            [6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
                            [7, 6, 9, 8, 1, 0, 3, 2, 5, 4],
                            [4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
                            [5, 4, 7, 6, 9, 8, 1, 0, 3, 2],
                            [2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
                            [3, 2, 5, 4, 7, 6, 9, 8, 1, 0]];
var SAME_YINYANG_SHItoKAN = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];
var TSUHENSEI = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "正印" ];

function make_tsuhensei(meishiki){
    let nikkan = KAN.indexOf(meishiki[1][0]);
    let nitshi = culc_matrix([1, 1], nikkan);
    let jikan = "";
    let jishi = "";
    if(KAN.includes(meishiki[0][0])){ jikan = culc_matrix([0, 0], nikkan); }
    else{jikan = "不明";}
    if(SHI.includes(meishiki[0][1])){ jishi = culc_matrix([0, 1], nikkan); }
    else{jishi = "不明";}
    let gekkan = culc_matrix([2, 0], nikkan);
    let getshi = culc_matrix([2, 1], nikkan);
    let nenkan = culc_matrix([3, 0], nikkan);
    let nenshi = culc_matrix([3, 1], nikkan);

    let jikan_tsuhensei = document.getElementById("jikan_tsuhensei");
    jikan_tsuhensei.innerHTML = jikan;
    let jishi_tsuhensei = document.getElementById("jishi_tsuhensei");
    jishi_tsuhensei.innerHTML = jishi;
    let nikkan_tsuhensei = document.getElementById("nikkan_tsuhensei");
    nikkan_tsuhensei.innerHTML = "　　";
    let nitshi_tsuhensei = document.getElementById("nitshi_tsuhensei");
    nitshi_tsuhensei.innerHTML = nitshi;
    let gekkan_tsuhensei = document.getElementById("gekkan_tsuhensei");
    gekkan_tsuhensei.innerHTML = gekkan;
    let getshi_tsuhensei = document.getElementById("getshi_tsuhensei");
    getshi_tsuhensei.innerHTML = getshi;
    let nenkan_tsuhensei = document.getElementById("nenkan_tsuhensei");
    nenkan_tsuhensei.innerHTML = nenkan;
    let nenshi_tsuhensei = document.getElementById("nenshi_tsuhensei");
    nenshi_tsuhensei.innerHTML = nenshi;
}

function culc_matrix(idx, nikkan){
    let result = ""
    if(idx[1] == 0){
        result = TSUHENSEI[TSUHENSEI_MATRIX[nikkan][KAN.indexOf(meishiki[idx[0]][idx[1]])]];
    }else if(idx[1] == 1){
        result = TSUHENSEI[TSUHENSEI_MATRIX[nikkan][  SAME_YINYANG_SHItoKAN[  SHI.indexOf(  meishiki[idx[0]][idx[1]]  )  ]  ]];
    }else{
        alert("エラー：通編成計算")
    }
    return result;
}

function make_daiun(meishiki, sex, birth_date, setsuiri_data){
    let jun_un = 0;
    let nenkan_yang = ((KAN.indexOf(meishiki[3][0]) + 1) % 2)

    // 順運か逆運か
    if(sex == 1){
        if(nenkan_yang == 1){
            jun_un = 1;
        }else{
            jun_un = -1;
        }
    }else{
        if(nenkan_yang == 1){
            jun_un = -1;
        }else{
            jun_un = 1;
        }
    }

    // 大運の起点となる干支
    let kanshi = ROKUJU_KANSHI_str.indexOf(meishiki[2][0] + meishiki[2][1]);

    let daiun = [];
    for(i = 0; i <= 12; i++){
        kanshi += jun_un;
        if(kanshi >= 60){
            kanshi = 0;   
        }
        if(kanshi < 0){
            kanshi = 59;
        }
        daiun.push( ROKUJU_KANSHI_str[kanshi] )
    }
    
    // 立運
    let term_ritsuun = 0
    for(i = 0; i < setsuiri_data.length; i++){
        if(birth_date.getFullYear() == Number(setsuiri_data[i][0]) && birth_date.getMonth() + 1 == Number(setsuiri_data[i][1])){
            let setsuiri_date = new Date(setsuiri_data[i][0], Number(setsuiri_data[i][1]) - 1, setsuiri_data[i][2] , setsuiri_data[i][3], setsuiri_data[i][4]);
            let d = 0;
            if(jun_un == 1){
                if(birth_date - setsuiri_date > 0){
                    d = new Date(setsuiri_data[i][0], setsuiri_data[i][1], setsuiri_data[i][2], setsuiri_data[i][3], setsuiri_data[i][4]);
                }else{
                    d = new Date(setsuiri_data[i-1][0], setsuiri_data[i-1][1], setsuiri_data[i-1][2], setsuiri_data[i-1][3], setsuiri_data[i-1][4]);
                }
            }else{

                if(birth_date - setsuiri_date > 0){
                    d = new Date(setsuiri_data[i-1][0], setsuiri_data[i-1][1], setsuiri_data[i-1][2], setsuiri_data[i-1][3], setsuiri_data[i-1][4]);
                }else{
                    d = new Date(setsuiri_data[i-2][0], setsuiri_data[i-2][1], setsuiri_data[i-2][2], setsuiri_data[i-2][3], setsuiri_data[i-2][4]);
                }

            }

            term_ritsuun = Math.abs(birth_date - d) / 86400000;

            term_ritsuun = Math.round((term_ritsuun / 3) * 10 ) / 10;
        }
    }
    let daiun_nen = []
    for(i = 0; i <= 12; i++){
        if(i == 0){
            daiun_nen.push(term_ritsuun + i * 10);
        }else{
            daiun_nen.push(Math.round(term_ritsuun) + i * 10);
        }
    }

    // 表示
    let daiun_body = document.getElementsByClassName("daiun_body")[0];
    let daiun_table = document.createElement("table");
    daiun_body.appendChild(daiun_table);

    let daiun_row = [];
    let daiun_nen_hyoji = []
    let daiun_kan = [];
    let daiun_shi = [];
    let today = new Date();
    for(j = 0; j < 3; j++){
        for(i = 0; i < daiun.length ; i++){
            daiun_row.push(document.createElement("tr"));
            daiun_table.appendChild(daiun_row[j]);
            if(j == 0){
                daiun_nen_hyoji.push(document.createElement("td"));
                daiun_nen_hyoji[i].textContent = daiun_nen[i];
                daiun_row[j].appendChild(daiun_nen_hyoji[i]);
                daiun_nen_hyoji[i].style.color = "#fac883";
                daiun_nen_hyoji[i].style.fontSize = "60%";
                daiun_nen_hyoji[i].style.fontFamily  = "Century";
                let nenrei = today.getFullYear() - birth_date.getFullYear() 
                try {
                    if(daiun_nen[i] <= nenrei && nenrei < daiun_nen[i + 1] ){
                        daiun_nen_hyoji[i].style.backgroundColor = "#fac883";
                        daiun_nen_hyoji[i].style.color = "#212324";
                    }    
                } catch (error) {
                   console.log(error); 
                }
                
            }else if(j == 1){
                daiun_kan.push(document.createElement("td"));
                daiun_kan[i].textContent = daiun[i][0];
                daiun_row[j].appendChild(daiun_kan[i]);
                let c = Math.floor(KAN.indexOf(daiun[i][0]) / 2);
                daiun_kan[i].style.backgroundColor  = GOGYO_COLOR[c];
            }else if(j == 2){
                daiun_shi.push(document.createElement("td"));
                daiun_shi[i].textContent = daiun[i][1];   
                daiun_row[j].appendChild(daiun_shi[i]);   
                let gogyo_shi = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
                let c = gogyo_shi[SHI.indexOf(daiun[i][1])]
                daiun_shi[i].style.backgroundColor  = GOGYO_COLOR[c]; 
            }
        }
    }
}


function make_ryuun(birth_date, is_setsuiri){
    // 年運計算
    const len = 124;
    const kijun_date = 2023;
    const kanshi = "癸卯";
    const today = new Date();

    let gap = birth_date.getFullYear() - kijun_date;
    let nenun = [];
    let nenun_nen = [];
    let toshi = [];         // 年齢。数え年ではない
    for(i = 0; i <= len; i++){
        let j = (ROKUJU_KANSHI_str.indexOf(kanshi) + gap + i) % 60;
        if(j < 0){
            j += 60;
        }
        nenun.push(ROKUJU_KANSHI_str[j]);
        nenun_nen.push(birth_date.getFullYear() + i);
        toshi.push(i);
    }

    // 表示
    let nenun_body = document.getElementsByClassName("nenun_body")[0];
    let nenun_table = document.createElement("table");
    nenun_body.appendChild(nenun_table);

    let nenun_row = [];
    let nenun_nen_hyoji = []
    let nenun_kan = [];
    let nenun_shi = [];
    let nen_hyoji = [];
    for(j = 0; j < 4; j++){
        for(i = 0; i < nenun.length ; i++){
            nenun_row.push(document.createElement("tr"));
            nenun_table.appendChild(nenun_row[j]);
            if(j == 0){
                nenun_nen_hyoji.push(document.createElement("td"));
                nenun_nen_hyoji[i].textContent = nenun_nen[i];
                nenun_row[j].appendChild(nenun_nen_hyoji[i]);
                nenun_nen_hyoji[i].style.color = "#fac883";
                nenun_nen_hyoji[i].style.fontSize = "60%";
                nenun_nen_hyoji[i].style.fontFamily  = "Century";
                if(toshi[i] + birth_date.getFullYear() == today.getFullYear()){
                    nenun_nen_hyoji[i].style.backgroundColor = "#fac883";
                    nenun_nen_hyoji[i].style.color = "#212324";
                    let elem = nenun_nen_hyoji[i];
                }
            }else if(j == 1){
                nenun_kan.push(document.createElement("td"));
                nenun_kan[i].textContent = nenun[i][0];
                nenun_row[j].appendChild(nenun_kan[i]);
                let c = Math.floor(KAN.indexOf(nenun[i][0]) / 2);

                nenun_kan[i].style.backgroundColor  = GOGYO_COLOR[c];
            }else if(j == 2){
                nenun_shi.push(document.createElement("td"));
                nenun_shi[i].textContent = nenun[i][1];   
                nenun_row[j].appendChild(nenun_shi[i]);   

                let gogyo_shi = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
                let c = gogyo_shi[SHI.indexOf(nenun[i][1])]
                nenun_shi[i].style.backgroundColor  = GOGYO_COLOR[c]; 
            }else if(j == 3){
                nen_hyoji.push(document.createElement("td"));
                nen_hyoji[i].textContent = toshi[i];
                nenun_row[j].appendChild(nen_hyoji[i]);
                nen_hyoji[i].style.color = "#fac883";
                nen_hyoji[i].style.fontSize = "60%";
                nen_hyoji[i].style.fontFamily = "Century";
                if(toshi[i] + birth_date.getFullYear() == today.getFullYear()){
                    nen_hyoji[i].style.backgroundColor = "#fac883";
                    nen_hyoji[i].style.color = "#212324";
                }
            }        
        }
    }
    
    // 月運計算
    const getsu_len = 36;
    const kijun_year = 2023;
    const kijun_getsu = 1;

    let gap_g = today.getFullYear() * 12 + today.getMonth() - kijun_year * 12 + kijun_getsu;
    let getsuun = [];
    let getsuun_getsu = [];
    for(i = 0; i < getsu_len; i++){
        let j = (ROKUJU_KANSHI_str.indexOf(kanshi) + gap_g + i - 12 + 7) % 60;
        getsuun.push(ROKUJU_KANSHI_str[j]);
        getsuun_getsu.push(i % 12 + 1);
    }

    // 月運 表示
    let getsuun_body = document.getElementsByClassName("getsuun_body")[0];
    let getsuun_table = document.createElement("table");
    getsuun_body.appendChild(getsuun_table);

    // 今日が節入りしているかどうか判定

    let getsuun_row = [];
    let getsuun_getsu_hyoji = []
    let getsuun_kan = [];
    let getsuun_shi = [];
    for(j = 0; j < 4; j++){
        for(i = 0; i < getsuun.length ; i++){
            getsuun_row.push(document.createElement("tr"));
            getsuun_table.appendChild(getsuun_row[j]);
            if(j == 0){
                getsuun_getsu_hyoji.push(document.createElement("td"));
                getsuun_getsu_hyoji[i].textContent = getsuun_getsu[i];
                getsuun_row[j].appendChild(getsuun_getsu_hyoji[i]);
                getsuun_getsu_hyoji[i].style.color = "#fac883";
                getsuun_getsu_hyoji[i].style.fontSize = "60%";
                getsuun_getsu_hyoji[i].style.fontFamily  = "Century";
                
                if((Math.floor(i / 12) == 1) && (today.getMonth() == getsuun_getsu[i] + is_setsuiri)){
                    getsuun_getsu_hyoji[i].style.backgroundColor = "#fac883";
                    getsuun_getsu_hyoji[i].style.color = "#212324";
                }
            }else if(j == 1){
                getsuun_kan.push(document.createElement("td"));
                getsuun_kan[i].textContent = getsuun[i][0];
                getsuun_row[j].appendChild(getsuun_kan[i]);
                let c = Math.floor(KAN.indexOf(getsuun[i][0]) / 2);
                getsuun_kan[i].style.backgroundColor  = GOGYO_COLOR[c];
            }else if(j == 2){
                getsuun_shi.push(document.createElement("td"));
                getsuun_shi[i].textContent = getsuun[i][1];   
                getsuun_row[j].appendChild(getsuun_shi[i]);   
                let gogyo_shi = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
                let c = gogyo_shi[SHI.indexOf(getsuun[i][1])]
                getsuun_shi[i].style.backgroundColor  = GOGYO_COLOR[c]; 
            }
        }
    }
}

function count_gogyo(meishiki){
    const SHI_GOGYO = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
    let num_gogyo = [0, 0, 0, 0, 0];
    
    for(i = 0; i <= 3; i++){
        // 天干の五行を数える
        let tmp1 = Math.floor(KAN.indexOf(meishiki[i][0]) / 2);
        num_gogyo[tmp1] += 1;
        // 地支の五行を数える
        let tmp2 = SHI_GOGYO[SHI.indexOf(meishiki[i][1])];
        num_gogyo[tmp2] += 1;
    }

    let moku = document.getElementById("moku");
    moku.innerHTML = "木(" + num_gogyo[0] + ")";
    let ka = document.getElementById("ka");
    ka.innerHTML = "火(" + num_gogyo[1] + ")";
    let tsuchi = document.getElementById("do");
    tsuchi.innerHTML = "土(" + num_gogyo[2] + ")";
    let kin = document.getElementById("kin");
    kin.innerHTML = "金(" + num_gogyo[3] + ")"
    let sui = document.getElementById("sui");
    sui.innerHTML = "水(" + num_gogyo[4] + ")";
}

function make_zokan(meishiki){
    let chishi_zokan = ["", "", "", ""]
    for(i = 0; i <= 3; i++){
        if(meishiki[i][1] != "不明"){
            chishi_zokan[i] = ZOKAN[SHI.indexOf(meishiki[i][1])];
        }
    }

    let jishi_zokan = document.getElementById("jishi_zokan");
    jishi_zokan.innerHTML = chishi_zokan[0];
    let nitshi_zokan = document.getElementById("nitshi_zokan");
    nitshi_zokan.innerHTML = chishi_zokan[1];
    let getshi_zokan = document.getElementById("getshi_zokan");
    getshi_zokan.innerHTML = chishi_zokan[2];
    let nenshi_zokan = document.getElementById("nenshi_zokan");
    nenshi_zokan.innerHTML = chishi_zokan[3];
}

function make_gochukei(meishiki){
    let gochukei_list = [];

    for(let i = 0; i <= 1; i++){
        for(let j = 0; j <= 2; j++){
            tmp = make_pair_gochukei(meishiki[j][i], meishiki[j+1][i]);
            gochukei_list = gochukei_list.concat(tmp);
        }
    }
    // 三合
    tmp = make_san_go(meishiki);
    gochukei_list = gochukei_list.concat(tmp);

    // 三刑
    tmp = make_san_kei(meishiki);
    gochukei_list = gochukei_list.concat(tmp);

    let gochukei_display = "";
    for(let i = 0; i < gochukei_list.length; i++){
        if((i >= 1) && (gochukei_list[i][0] == gochukei_list[i-1][0])){
            gochukei_display += ", " + gochukei_list[i][1]
        }else{
            gochukei_display += "　" + gochukei_list[i][0] + ": " + gochukei_list[i][1]
        }
    }

    let gochukei = document.getElementById("go_chu_kei");
    gochukei.innerHTML = gochukei_display;
}

function make_pair_gochukei(str1, str2){
    let pair_ji = str1 + str2;
    let gochukei_list = [];

    // 干合
    let kan_go_pair = [];
    const kango_goka = ["土", "金", "水", "木", "火"];
    for(let i = 0; i <= 4; i++){
        kan_go_pair[i] = KAN[i] + KAN[i + 5];
        kan_go_pair[i + 5] = KAN[i + 5] + KAN[i];
    }
    if(kan_go_pair.includes(pair_ji)){
        gochukei_list.push(["干合", pair_ji + "(" + kango_goka[Math.floor(kan_go_pair.indexOf(pair_ji) % 5)] + ")"]);
    }

    // 六合
    const riku_go_pair = ["寅亥", "卯戌", "辰酉", "巳申", "午未", "子丑",
                          "亥寅", "戌卯", "酉辰", "申巳", "未午", "丑子"];
    const rikugo_goka = ["土", "火", "金", "水", "空", "土"];
    if(riku_go_pair.includes(pair_ji)){
        gochukei_list.push(["六合", pair_ji + "(" + rikugo_goka[Math.floor(riku_go_pair.indexOf(pair_ji) % 6)] + ")"])
    }

    // 天干 冲
    const tenkan_chu_pair = ["甲庚", "庚甲", "乙辛", "辛乙", "丙壬", "壬丙", "丁癸", "癸丁"];
    if(tenkan_chu_pair.includes(pair_ji)){
        gochukei_list.push(["冲", pair_ji]);
    }

    // 地支 冲
    const chishi_chu_pair = ["子午", "午子", "丑未", "未丑", "寅申", "申寅", "卯酉", "酉卯", "辰戌", "戌辰", "巳亥", "亥巳"];
    if(chishi_chu_pair.includes(pair_ji)){
        gochukei_list.push(["冲", pair_ji]);
    }

    // 相刑
    const sokei_pair = ["子卯"]
    if(sokei_pair.includes(pair_ji)){
        gochukei_list.push(["刑", pair_ji]);
    }

    //　自刑
    const jike_pair = ["辰辰", "午午", "酉酉", "亥亥"];
    if(jike_pair.includes(pair_ji)){
        gochukei_list.push(["刑", pair_ji]);
    }

    return gochukei_list;
}

// 六合
const san_go_pair = ["寅午戌", "寅戌午", "午寅戌", "午戌寅", "戌寅午", "戌午寅",
                     "巳酉丑", "巳丑酉", "酉巳丑", "酉丑巳", "丑巳酉", "丑酉巳",
                     "申子辰", "申辰子", "子申辰", "子辰申", "辰申子", "辰子申",
                     "亥卯未", "亥未卯", "卯亥未", "卯未亥", "未亥卯", "未卯亥"]
// 二合
const ni_go_pair =  ["寅午", "寅戌", "午寅", "午戌", "戌寅", "戌午",
                     "巳酉", "巳丑", "酉巳", "酉丑", "丑巳", "丑酉",
                     "申子", "申辰", "子申", "子辰", "辰申", "辰子",
                     "亥卯", "亥未", "卯亥", "卯未", "未亥", "未卯"]
const sango_goka = ["火", "金", "水", "木"]

function make_san_go(meishiki){
    let gochukei_list = [];

    for(let i = 0; i <= 1; i++){
        let group = meishiki[0 + i][1] + meishiki[1 + i][1] + meishiki[2 + i][1];
        if(san_go_pair.includes(group)){
            if(i == 1){
                other_pair = meishiki[0][1] + meishiki[1][1];
                if(ni_go_pair.includes(other_pair)){
                    gochukei_list.push(["二合", other_pair + "(" + sango_goka[Math.floor(ni_go_pair.indexOf(other_pair) / 6)] + ")"]);
                }    
            }
            gochukei_list.push(["三合", group + "(" + sango_goka[Math.floor(san_go_pair.indexOf(group) / 6)] + ")"]);
            if(i == 0){
                other_pair = meishiki[2][1] + meishiki[3][1];
                if(ni_go_pair.includes(other_pair)){
                    gochukei_list.push(["二合", other_pair + "(" + sango_goka[Math.floor(ni_go_pair.indexOf(other_pair) / 6)] + ")"]);
                }    
            }
        }
    }

    if(gochukei_list.length <= 0){
        for(let i = 0; i < 3; i++){
            tmp = make_pair_nigo(meishiki[i][1], meishiki[i+1][1]);
            if(tmp.length >= 1){
                gochukei_list = gochukei_list.concat(tmp);
            }
        }
    }

    return gochukei_list;
}

function make_pair_nigo(str1, str2){
    let gochukei_list = [];
    let pair_ji = str1 + str2;

    if(ni_go_pair.includes(pair_ji)){
        gochukei_list.push(["二合", pair_ji + "(" + sango_goka[Math.floor(ni_go_pair.indexOf(pair_ji) / 6)] + ")"]);
    }
    return gochukei_list;
}

// 三刑
const san_kei_pair = ["丑未戌", "丑戌未", "未丑戌", "未戌丑", "丑未戌", "丑戌未",
                     "寅巳申", "寅申巳", "巳寅申", "巳申寅", "申巳寅", "申寅巳"];
const san_kei_ni_pair =  ["丑未", "丑戌", "未丑", "未戌", "丑未", "丑戌",
                      "寅巳", "寅申", "巳寅", "巳申", "申巳", "申寅"];

function make_san_kei(meishiki){
    let gochukei_list = [];

    for(let i = 0; i <= 1; i++){
        let group = meishiki[0 + i][1] + meishiki[1 + i][1] + meishiki[2 + i][1];
        if(san_kei_pair.includes(group)){
            if(i == 1){
                other_pair = meishiki[0][1] + meishiki[1][1];
                if(san_kei_ni_pair.includes(other_pair)){
                    gochukei_list.push(["刑", other_pair]);
                }    
            }
            gochukei_list.push(["刑", group]);
            if(i == 0){
                other_pair = meishiki[2][1] + meishiki[3][1];
                if(san_kei_ni_pair.includes(other_pair)){
                    gochukei_list.push(["刑", other_pair]);
                }    
            }
        }
    }

    if(gochukei_list.length <= 0){
        for(let i = 0; i < 3; i++){
            tmp = make_pair_sankei_ni(meishiki[i][1], meishiki[i+1][1]);
            if(tmp.length >= 1){
                gochukei_list = gochukei_list.concat(tmp);
            }
        }
    }

    return gochukei_list;
}

function make_pair_sankei_ni(str1, str2){
    let gochukei_list = [];
    let pair_ji = str1 + str2;

    if(san_kei_ni_pair.includes(pair_ji)){
        gochukei_list.push(["刑", pair_ji]);
    }
    return gochukei_list;
}
