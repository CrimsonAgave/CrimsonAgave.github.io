document.addEventListener('DOMContentLoaded', function() {
    readPage();
});

function umu_to_int(v){
    result = -1;
    if(v == "不明"){
        result = 0;
    }else if(v == "有"){
        result = 1;
    }else if(v == "無"){
        result = 2;
    }else{
        location.href = "4chu_reverse_search.html";
    }
    return result;
}

function convertCSVtoArray(csv){
    let result = [];
    let tmp = csv.split("\r\n");
    
    for(i = 0; i < tmp.length; i++){
        if(tmp[i] != ""){
            result[i] = tmp[i].split(",");
        }
    }
    return result;
}


function readPage(){
    const url = new URL(window.location.href);
    const parameters = url.searchParams;

    let jikan_jitshin = parameters.get("jikan_jitshin");

    let gekkan_jitshin = parameters.get("gekkan_jitshin");
    let nenkan_jitshin = parameters.get("nenkan_jitshin");

    let jikan = parameters.get("jikan");
    let nikkan = parameters.get("nikkan");
    let gekkan = parameters.get("gekkan");
    let nenkan = parameters.get("nenkan");

    let jishi = parameters.get("jishi");
    let nitshi = parameters.get("nitshi");
    let getshi = parameters.get("getshi");
    let nenshi = parameters.get("nenshi");

    let jishi_jitshin = parameters.get("jishi_jitshin");
    let nitshi_jitshin = parameters.get("nitshi_jitshin");
    let getshi_jitshin = parameters.get("getshi_jitshin");
    let nenshi_jitshin = parameters.get("nenshi_jitshin");

    let specified_jitshin = [jikan_jitshin, jishi_jitshin, "", nitshi_jitshin, gekkan_jitshin, getshi_jitshin, nenkan_jitshin, nenshi_jitshin];
    let specified_meishiki = [jikan, jishi, nikkan, nitshi, gekkan, getshi, nenkan, nenshi];
    let exist = [];
    let unexist = [];

    let gogyo_moku = umu_to_int(parameters.get("moku"));
    let gogyo_ka = umu_to_int(parameters.get("ka"));
    let gogyo_do = umu_to_int(parameters.get("do"));
    let gogyo_kin = umu_to_int(parameters.get("kin"));
    let gogyo_sui = umu_to_int(parameters.get("sui"));

    if(gogyo_moku == 1){exist.push("木");}
    if(gogyo_ka == 1){exist.push("火");}
    if(gogyo_do == 1){exist.push("土");}
    if(gogyo_kin == 1){exist.push("金");}
    if(gogyo_sui == 1){exist.push("水");}
    if(gogyo_moku == 2){unexist.push("木");}
    if(gogyo_ka == 2){unexist.push("火");}
    if(gogyo_do == 2){unexist.push("土");}
    if(gogyo_kin == 2){unexist.push("金");}
    if(gogyo_sui == 2){unexist.push("水");}

    hiken_umu = umu_to_int(parameters.get("hiken_umu"));
    shokushin_umu = umu_to_int(parameters.get("shokushin_umu"));
    henzai_umu = umu_to_int(parameters.get("henzai_umu"));
    henkan_umu = umu_to_int(parameters.get("henkan_umu"));
    hennin_umu = umu_to_int(parameters.get("hennin_umu"));
    gozai_umu = umu_to_int(parameters.get("gozai_umu"));
    shokan_umu = umu_to_int(parameters.get("shokan_umu"));
    sezai_umu = umu_to_int(parameters.get("sezai_umu"));
    sekan_umu = umu_to_int(parameters.get("sekan_umu"));
    sein_umu = umu_to_int(parameters.get("sein_umu"));

    if(hiken_umu == 1){exist.push("比肩");}
    if(shokushin_umu == 1){exist.push("食神");}
    if(henzai_umu == 1){exist.push("偏財");}
    if(henkan_umu == 1){exist.push("偏官");}
    if(hennin_umu == 1){exist.push("偏印");}
    if(gozai_umu == 1){exist.push("劫財");}
    if(shokan_umu == 1){exist.push("傷官");}
    if(sezai_umu == 1){exist.push("正財");}
    if(sekan_umu == 1){exist.push("正官");}
    if(sein_umu == 1){exist.push("正印");}

    if(hiken_umu == 2){unexist.push("比肩");}
    if(shokushin_umu == 2){unexist.push("食神");}
    if(henzai_umu == 2){unexist.push("偏財");}
    if(henkan_umu == 2){unexist.push("偏官");}
    if(hennin_umu == 2){unexist.push("偏印");}
    if(gozai_umu == 2){unexist.push("劫財");}
    if(shokan_umu == 2){unexist.push("傷官");}
    if(sezai_umu == 2){unexist.push("正財");}
    if(sekan_umu == 2){unexist.push("正官");}
    if(sein_umu == 2){unexist.push("正印");}

    jikkan_one = umu_to_int(parameters.get("jikkan_one"));
    jikkan_two = umu_to_int(parameters.get("jikkan_two"));
    jikkan_three = umu_to_int(parameters.get("jikkan_three"));
    jikkan_four = umu_to_int(parameters.get("jikkan_four"));
    jikkan_five = umu_to_int(parameters.get("jikkan_five"));
    jikkan_six = umu_to_int(parameters.get("jikkan_six"));
    jikkan_seven = umu_to_int(parameters.get("jikkan_seven"));
    jikkan_eight = umu_to_int(parameters.get("jikkan_eight"));
    jikkan_nine = umu_to_int(parameters.get("jikkan_nine"));
    jikkan_ten = umu_to_int(parameters.get("jikkan_ten"));

    if(jikkan_one == 1){exist.push("甲");}
    if(jikkan_two == 1){exist.push("乙");}
    if(jikkan_three == 1){exist.push("丙");}
    if(jikkan_four == 1){exist.push("丁");}
    if(jikkan_five == 1){exist.push("戊");}
    if(jikkan_six == 1){exist.push("己");}
    if(jikkan_seven == 1){exist.push("庚");}
    if(jikkan_eight == 1){exist.push("辛");}
    if(jikkan_nine == 1){exist.push("壬");}
    if(jikkan_ten == 1){exist.push("癸");}

    if(jikkan_one == 2){unexist.push("甲");}
    if(jikkan_two == 2){unexist.push("乙");}
    if(jikkan_three == 2){unexist.push("丙");}
    if(jikkan_four == 2){unexist.push("丁");}
    if(jikkan_five == 2){unexist.push("戊");}
    if(jikkan_six == 2){unexist.push("己");}
    if(jikkan_seven == 2){unexist.push("庚");}
    if(jikkan_eight == 2){unexist.push("辛");}
    if(jikkan_nine == 2){unexist.push("壬");}
    if(jikkan_ten == 2){unexist.push("癸");}

    chishi_one = umu_to_int(parameters.get("chishi_one"));
    chishi_two = umu_to_int(parameters.get("chishi_two"));
    chishi_three = umu_to_int(parameters.get("chishi_three"));
    chishi_four = umu_to_int(parameters.get("chishi_four"));
    chishi_five = umu_to_int(parameters.get("chishi_five"));
    chishi_six = umu_to_int(parameters.get("chishi_six"));
    chishi_seven = umu_to_int(parameters.get("chishi_seven"));
    chishi_eight = umu_to_int(parameters.get("chishi_eight"));
    chishi_nine = umu_to_int(parameters.get("chishi_nine"));
    chishi_ten = umu_to_int(parameters.get("chishi_ten"));
    chishi_eleven = umu_to_int(parameters.get("chishi_eleven"));
    chishi_twelve = umu_to_int(parameters.get("chishi_twelve"));

    if(chishi_one == 1){exist.push("子");}
    if(chishi_two == 1){exist.push("丑");}
    if(chishi_three == 1){exist.push("寅");}
    if(chishi_four == 1){exist.push("卯");}
    if(chishi_five == 1){exist.push("辰");}
    if(chishi_six == 1){exist.push("巳");}
    if(chishi_seven == 1){exist.push("午");}
    if(chishi_eight == 1){exist.push("未");}
    if(chishi_nine == 1){exist.push("申");}
    if(chishi_ten == 1){exist.push("酉");}
    if(chishi_eleven == 1){exist.push("戌");}
    if(chishi_twelve == 1){exist.push("亥");}

    if(chishi_one == 2){unexist.push("子");}
    if(chishi_two == 2){unexist.push("丑");}
    if(chishi_three == 2){unexist.push("寅");}
    if(chishi_four == 2){unexist.push("卯");}
    if(chishi_five == 2){unexist.push("辰");}
    if(chishi_six == 2){unexist.push("巳");}
    if(chishi_seven == 2){unexist.push("午");}
    if(chishi_eight == 2){unexist.push("未");}
    if(chishi_nine == 2){unexist.push("申");}
    if(chishi_ten == 2){unexist.push("酉");}
    if(chishi_eleven == 2){unexist.push("戌");}
    if(chishi_twelve == 2){unexist.push("亥");}

    let first_year = parameters.get("min_year");
    let second_year = parameters.get("max_year");
    if(first_year > second_year){
        var min_year = second_year;
        var max_year = first_year;
    }else{
        var min_year = first_year;
        var max_year = second_year;
    }

    let birthdate_p = document.getElementById("birthdate_p");
    birthdate_p.innerHTML = "生年月日";

    let display_html = document.getElementById("range");
    display_html.innerHTML = min_year + "年 - " + max_year + "年";

    
    let request = new XMLHttpRequest();
    request.open("GET", "meishiki_date.csv", true);
    try{
        request.send(null)
    } catch(err){
        console.log(err)
    }

    request.onload = function(){

        possible_date_meishiki = [];
        MAX_LENGTH = 20;

        let data = convertCSVtoArray(request.responseText);
        for (let i = 0; i < data.length; i++) {  
            let year = data[i][0]
            let month = data[i][1]
            let day = data[i][2]
            let meishikis = [data[i][3]]
            if(data[i].length > 4){
                meishikis[1] = data[i][4]
            }
            if(min_year <= year && year <= max_year){
                for(let j = 0; j < meishikis.length; j++){
                    let is_ok = true;
                    meishiki = meishikis[j]
    
                    is_ok = compare_meishiki(meishiki, specified_meishiki)
                    if(is_ok){ is_ok = compare_jitshin(meishiki, specified_jitshin); }
                    if(is_ok){ is_ok = exist_check(meishiki, exist); }
                    if(is_ok){ is_ok = unexist_check(meishiki, unexist); }


                    if(is_ok){
                        str = year + "年" + month + "月" + day + "日　";
                        possible_date_meishiki.push(str + meishiki);
                    }    
                }
            }
        }
        
        let display_date_meishiki = possible_date_meishiki
        if(possible_date_meishiki.length > MAX_LENGTH){
            display_date_meishiki = possible_date_meishiki.slice(0, MAX_LENGTH);
            display_date_meishiki.push("…");
        }
        display_date_meishiki.push((possible_date_meishiki.length) + "件の候補")


        let display_str = display_date_meishiki.join("<BR>");
        let display_html = document.getElementById("birthdate");
        display_html.innerHTML = display_str;
    }
}


const KAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const SHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const KANSHI_str = KAN.concat(SHI);
var ROKUJU_KANSI = [];
for(let i = 0; i < 60; i++){
    ROKUJU_KANSI.push(KAN[i%10] + SHI[i%12]);
}
var JI_KANSHI = [];
for(let i = 0; i < 5; i++){
    JI_KANSHI.push([]);
    for(let j = 0; j < 12; j++){
        JI_KANSHI[i].push([(2 * i + j) % 10, j % 12])
    }
}
for(let i = 0; i < 5; i++){
    JI_KANSHI[i].push([(JI_KANSHI[i][0][0] + 2) % 10, JI_KANSHI[i][0][1]])
}

function make_jichu(meishiki){
    let jichu_list = [];

    nikkan = meishiki[2]
    kan_idx = KAN.indexOf(nikkan) % 5;

    for(let i = 0; i < 13; i++){
        shi_idx = i;

        kan = KAN[JI_KANSHI[kan_idx][shi_idx][0]]
        shi = SHI[JI_KANSHI[kan_idx][shi_idx][1]]
        jichu_list.push(kan + shi);
    }

    return jichu_list;
}

function make_jichu_jitshin(meishiki){
    let jichu_jitshin_list = [];

    nikkan = meishiki[2]
    kan_idx = KAN.indexOf(nikkan) % 5;

    for(let i = 0; i < 13; i++){
        shi_idx = i;

        kan = KAN[JI_KANSHI[kan_idx][shi_idx][0]]
        shi = SHI[JI_KANSHI[kan_idx][shi_idx][1]]

        kan_jitshin = JITSHIN[JITSHIN_MATRIX[KAN.indexOf(meishiki[2])][KAN.indexOf(kan)]];
        shi_jitshin = JITSHIN[JITSHIN_MATRIX[KAN.indexOf(meishiki[2])][SAME_YINYANG_SHItoKAN[SHI.indexOf(shi)]]];

        jichu_jitshin_list.push(kan_jitshin + shi_jitshin);
    }

    return jichu_jitshin_list;
}



function compare_meishiki(meishiki_, specified_meishiki){
    let is_ok = true;
    let meishiki = [...meishiki_];
    meishiki.unshift("不明");
    meishiki.unshift("不明");
    
    // 時柱がマッチするか確かめる
    if(specified_meishiki[0] != "不明" && specified_meishiki[1] != "不明"){
        jichu_list = make_jichu(meishiki);
        specified_jikanshi = specified_meishiki[0] + specified_meishiki[1];
        if(jichu_list.includes(specified_jikanshi) == false){
            is_ok = false;
        }
    }

    // 時柱以外でマッチするか確認
    if(is_ok){
        for(let i = 2; i < meishiki.length; i++){
            if(meishiki[i] != "不明" && specified_meishiki[i] != "不明"){
                if(meishiki[i] != specified_meishiki[i]){
                    is_ok = false;
                    break;
                }
            }
        }
    }

    return is_ok
}

function compare_jitshin(meishiki_, specified_jitshin){
    let is_ok = true;
    let meishiki = [...meishiki_];
    meishiki.unshift("不明");
    meishiki.unshift("不明");
    jitshin = make_jitshin(meishiki);

    // 時柱がマッチするか確かめる
    if(specified_jitshin[0] != "不明" && specified_jitshin[1] != "不明"){
        jichu_jitshin_list = make_jichu_jitshin(meishiki);
        specified_jikanshi_jitshin = specified_jitshin[0] + specified_jitshin[1];
        if(jichu_jitshin_list.includes(specified_jikanshi_jitshin) == false){
            is_ok = false;
        }
    }

    // 時柱以外でマッチするか確認
    if(is_ok){
        for(let i = 2; i < jitshin.length; i++){
            if(jitshin[i] != "不明" && specified_jitshin[i] != "不明" && jitshin[i] != ""){
                if(jitshin[i] != specified_jitshin[i]){
                    is_ok = false;
                    break;
                }
            }
        }
    }

    return is_ok
}


const GOGYO = ["木", "火", "土", "金", "水"];
const KANSHI_GOGYO = {"甲": "木", "乙": "木", "丙": "火", 丁: "火", "戊": "土",
                      "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
                      "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土",
                      "巳": "火", "午": "火", "未": "土", "申": "金", "酉": "金",
                      "戌": "土", "亥": "水"};

function exist_check(meishiki_, exist){
    let is_ok = true;
    let meishiki = [...meishiki_];
    meishiki.unshift("不明");
    meishiki.unshift("不明");
    let jichu_list = make_jichu(meishiki);
    let new_jichu_list = [];

    // 五行があるかチェック
    for(let i = 0; i < GOGYO.length; i++){
        if(exist.includes(GOGYO[i])){

            // 時柱以外の命式に五行があるかチェック
            var gogyo_exit = false;
            for(let j = 2; j < meishiki.length; j++){
                if(KANSHI_GOGYO[meishiki[j]] == GOGYO[i]){
                    gogyo_exit = true;
                }
            }
            // 指定の五行のある時柱を new_jichu_list へ格納
            if(gogyo_exit == false){
                for(let j = 0; j < jichu_list.length; j++){

                    let tmp = (GOGYO[i] == KANSHI_GOGYO[jichu_list[j][0]]) + (GOGYO[i] == KANSHI_GOGYO[jichu_list[j][1]]);
                    if(tmp == true){
                        new_jichu_list.push(jichu_list[j]);
                    }
                }
                if(new_jichu_list.length <= 0){
                    is_ok = false;
                    break;
                }else{
                    jichu_list = [...new_jichu_list];
                    new_jichu_list = [];
                }
            }
        }
    }

    // 字があるかチェック
    if(is_ok){
        for(let i = 0; i < KANSHI_str.length; i++){
            if(exist.includes(KANSHI_str[i])){
    
                // 時柱以外の命式に干支があるかチェック
                var kanshi_exit = false;
                for(let j = 2; j < meishiki.length; j++){
                    if(meishiki[j] == KANSHI_str[i]){
                        kanshi_exit = true;
                    }
                }
                // 指定の干支のある時柱を new_jichu_list へ格納
                if(kanshi_exit == false){
                    for(let j = 0; j < jichu_list.length; j++){
    
                        let tmp = (KANSHI_str[i] == jichu_list[j][0]) + (KANSHI_str[i] == jichu_list[j][1]);
                        if(tmp == true){
                            new_jichu_list.push(jichu_list[j]);
                        }
                    }
                    if(new_jichu_list.length <= 0){
                        is_ok = false;
                        break;
                    }else{
                        jichu_list = [...new_jichu_list];
                        new_jichu_list = [];
                    }
                }
            }
        }
    
    }
    
    // 十神があるかチェック
    if(is_ok){
        jitshins = make_jitshin(meishiki);
        for(let i = 0; i < JITSHIN.length; i++){
            if(exist.includes(JITSHIN[i])){
    
                // 時柱以外の命式に干支があるかチェック
                var jitshin_exit = false;
                for(let j = 2; j < jitshins.length; j++){
                    if(jitshins[j] == JITSHIN[i]){
                        jitshin_exit = true;
                    }
                }
                // 指定の干支のある時柱を new_jichu_list へ格納
                if(jitshin_exit == false){
                    for(let j = 0; j < jichu_list.length; j++){
                        let tmp = ((JITSHIN[i] == JITSHIN[JITSHIN_MATRIX[KAN.indexOf(meishiki[2])][KAN.indexOf(jichu_list[j][0])]]) 
                                 + (JITSHIN[i] == JITSHIN[JITSHIN_MATRIX[KAN.indexOf(meishiki[2])][SAME_YINYANG_SHItoKAN[SHI.indexOf(jichu_list[j][1])]]]));
                        if(tmp == true){
                            new_jichu_list.push(jichu_list[j]);
                        }
                    }
                    if(new_jichu_list.length <= 0){
                        is_ok = false;
                        break;
                    }else{
                        jichu_list = [...new_jichu_list];
                        new_jichu_list = [];
                    }
                }
            }
        }
    
    }

    return is_ok;
}

function unexist_check(meishiki_, unexist){
    let is_ok = true;
    let meishiki = [...meishiki_];
    meishiki.unshift("不明");
    meishiki.unshift("不明");

    // 五行がないかチェック
    for(let i = 0; i < GOGYO.length; i++){
        if(unexist.includes(GOGYO[i])){
            for(let j = 2; j < meishiki.length; j++){
                if(GOGYO[i] == KANSHI_GOGYO[meishiki[j]]){
                    is_ok = false;
                }    
            }
        }
    }

    // 干支がないかチェック
    if(is_ok){
        for(let i = 0; i < KANSHI_str.length; i++){
            if(unexist.includes(KANSHI_str[i])){
                for(let j = 2; j < meishiki.length; j++){
                    if(KANSHI_str[i] == meishiki[j]){
                        is_ok = false;
                    }    
                }
            }
        }
    }

    // 十神がないかチェック
    if(is_ok){
        let jitsins = make_jitshin(meishiki);
        for(let i = 0; i < JITSHIN.length; i++){
            if(unexist.includes(JITSHIN[i])){
                for(let j = 2; j < meishiki.length; j++){
                    if(JITSHIN[i] == jitsins[j]){
                        is_ok = false;
                    }    
                }
            }
        }
    }


    return is_ok;
}


const JITSHIN_MATRIX   = [  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
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
const JITSHIN = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "正印" ];

function make_jitshin(meishiki){
    let jitshins = [];
    let jitshin = "";

    for(let i = 0; i < meishiki.length; i++){
        if(meishiki[i] == "不明"){
            jitshins.push("不明");
        }else{

            if(i == 2){
                jitshins.push("");
            }else{
                if(i % 2 == 0){
                    // 天干
                    jitshin = JITSHIN[JITSHIN_MATRIX[KAN.indexOf(meishiki[2])][KAN.indexOf(meishiki[i])]];
                }else{
                    // 地支
                    jitshin = JITSHIN[JITSHIN_MATRIX[KAN.indexOf(meishiki[2])][SAME_YINYANG_SHItoKAN[SHI.indexOf(meishiki[i])]]];
                }
                jitshins.push(jitshin);
            }
        }
    }

    return jitshins
}

