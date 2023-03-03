KA = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"]
KA_kanji = ["天", "沢", "火", "雷", "風", "水", "山", "地"]
DOUBLE_KA_NAME =[
    "乾為天", "夬", "大有", "大壮", "小畜", "需", "大畜", "泰",
    "履", "兌為沢", "睽", "帰妹", "中孚", "節", "損", "臨",
    "同人", "革", "離為火", "豊", "家人", "既済", "賁", "明夷",
    "无妄", "随", "噬嗑", "震為雷", "益", "屯", "頤", "復",
    "姤", "大過", "鼎", "恒", "巽為風", "井", "蠱", "升",
    "訟", "困", "未済", "解", "渙", "坎為水", "蒙", "師",
    "遯", "咸", "旅", "小過", "漸", "蹇", "艮為山", "謙", 
    "否", "萃", "普", "豫", "観", "比", "剝", "坤為地"
]
kansuji = ["一", "二", "三", "四", "五", "六"]

NUM_DOUBKE_KA = [
                1, 43, 14, 34, 9, 5, 26, 11,
                10, 58, 38, 54, 61, 60, 41, 19,
                13, 49, 30, 55, 37, 63, 22, 36,
                24, 17, 21, 51, 42, 3, 27, 24,
                44, 28, 50, 32, 57, 48, 18, 46, 
                6, 47, 64, 40, 59, 29, 4, 7,
                33, 31, 56, 62, 53, 39, 52, 15,
                12, 45, 35, 16, 20, 8, 23, 2
]

function ekisen(){
    rokujuyon_ka = [random_hakka(), random_hakka()];
    let kou_num = random_kou();

    let double_ka = document.getElementById("ka");
    double_ka.innerHTML = KA[rokujuyon_ka[0]] + KA[rokujuyon_ka[1]];

    let num = 1 + rokujuyon_ka[1] * 8 + rokujuyon_ka[0];

    let double_ka_name = document.getElementById("ka_name");
    if(rokujuyon_ka[0] != rokujuyon_ka[1]){
        double_ka_name.innerHTML = NUM_DOUBKE_KA[num-1] + ".　" + KA_kanji[rokujuyon_ka[0]] + KA_kanji[rokujuyon_ka[1]] + DOUBLE_KA_NAME[num-1];    
    }else{
        double_ka_name.innerHTML = NUM_DOUBKE_KA[num-1] + ".　" + DOUBLE_KA_NAME[num-1]
    }

    let kou = document.getElementById("kou");
    if(kou_num == 0){
        kou.innerHTML = "上爻";
    }else if(kou_num == 5){
        kou.innerHTML = "初爻";
    }else{
        kou.innerHTML = kansuji[kou_num] + "爻";
    }
    


    document.getElementById("eki_button").style.visibility = "hidden"
}


function random_hakka(){
    return Math.floor(Math.random() * 8);
}

function random_kou(){
    return Math.floor(Math.random() * 6);
}