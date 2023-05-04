# 四柱推命の命式を算出

KAN = ("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸")
SHI = ("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥")
ROKUJU_KANSI = [[KAN[i%10], SHI[i%12]]  for i in range(60)]
GETSU_KANSHI = []
for i in range(5):
    GETSU_KANSHI.append([])
    for j in range(12):
        kan = j + (2 * i + 3)
        if(j >= 1):
            kan -= 2; 
        kan %= 10
        GETSU_KANSHI[i].append([kan, (j + 1) % 12])

JI_KANSHI = []
for i in range(5):
    JI_KANSHI.append([])
    for j in range(12):
        JI_KANSHI[i].append([(2 * i + j) % 10, j % 12])
for i in range(5):
    JI_KANSHI[i].append(JI_KANSHI[i][0])

import sys
import datetime
import calendar
import math


class FourPillar():
    def __init__(self, is_non_time, year, month, day, hour, minute, time_defference=None):        
        self.is_non_time = is_non_time
        self.birthdate = datetime.datetime(year, month, day, hour, minute)
        with open("sekki_24_simplified.csv") as f:
            self.setsuiri_data = f.readlines()
            self.setsuiri_data = [line.replace("\n", "").split(",") for line in self.setsuiri_data]
        
        self.four_pillar = self.make_four_pillar()

    def make_four_pillar(self):
        self.is_setsuiri = 0
        self.on_setsuiri = False
        for d in self.setsuiri_data:
            d = [int(e) for e in d]
            sekki_date = datetime.datetime(d[0], d[1], d[2], d[3], d[4])
            if((self.birthdate.year == sekki_date.year) 
               and (self.birthdate.month == sekki_date.month)
               and self.birthdate > sekki_date):
                self.is_setsuiri = 1
            if((self.birthdate.year == sekki_date.year) 
               and (self.birthdate.month == sekki_date.month)
               and self.birthdate.day == sekki_date.day):
                self.on_setsuiri = True

        nenkanshi_idx = self.make_nenkanshi()
        gekkanshi_idx = self.make_gekkanshi(nenkanshi_idx)
        nikkanshi_idx = self.make_nikkanshi()
        jikanshi_idx = self.make_jikanshi(nikkanshi_idx)
        
        self.four_pillar = [nenkanshi_idx, gekkanshi_idx, nikkanshi_idx]
        if(self.on_setsuiri):
            self.four_pillar.extend([nenkanshi_idx, [(gekkanshi_idx[0]+1) % 10, (gekkanshi_idx[1]+1) % 12], nikkanshi_idx])
        return self.four_pillar

    def get_int_four_pillar(self):
        return self.four_pillar
    
    def get_str_four_pillar(self):
        str_fp = []
        for p in self.four_pillar:
            if(p[0] != -1 or p[1] != -1):
                str_fp.append([KAN[p[0]], SHI[p[1]]])
            else:
                str_fp.append(["不明", "不明"])
        return str_fp
    
    def make_nenkanshi(self):
        kanshi_idx = (self.birthdate.year -3) % 60 - 2

        # 立春以降の場合、kanshi_idx に +1
        for d in self.setsuiri_data:
            d = [int(e) for e in d]
            sekki_date = datetime.datetime(d[0], d[1], d[2], d[3], d[4])
            if((self.birthdate.year == sekki_date.year) 
            and sekki_date.month == 2):
                ritshun_date = sekki_date
                if(ritshun_date <= self.birthdate):
                    kanshi_idx += 1

        kan_idx = kanshi_idx % 10
        shi_idx = kanshi_idx % 12
        return [kan_idx, shi_idx]

    def make_gekkanshi(self, nenkanshi_idx):
        kan_idx = (nenkanshi_idx[0] % 10) % 5
        shi_idx = (self.birthdate.month - 2 + self.is_setsuiri ) % 12
        
        return GETSU_KANSHI[kan_idx][shi_idx]

    def make_nikkanshi(self):
        criterion = datetime.datetime(1970, 1, 1, 0, 0)
        gap_year = self.birthdate.year - criterion.year
        gap_month = 0
        for i in range(1, self.birthdate.month):
            gap_month = gap_month + calendar.monthrange(self.birthdate.year, i)[1] 
        gap_day = 365 * gap_year + math.floor((gap_year -3) /4) + gap_month + self.birthdate.day
        
        nikkanshi_idx = (gap_day - 43) % 60

        kan_idx = nikkanshi_idx % 10
        shi_idx = nikkanshi_idx % 12
        return [kan_idx, shi_idx]
    
    def make_jikanshi(self, nikkanshi_idx):
        if(self.is_non_time):
            kan_idx = -1
            shi_idx = -1
            return [kan_idx, shi_idx]
        else:
            kan_idx = nikkanshi_idx[0] % 5
            shi_idx = math.floor((self.birthdate.hour+1) / 2)
            if(self.birthdate.hour >= 23):
                kan_idx = (kan_idx + 1) % 5
                
            return JI_KANSHI[kan_idx][shi_idx]
        
import calendar
from tqdm import tqdm
if __name__ == "__main__":
    MIN_YEAR = 1851
    MAX_YEAR = 2049
    lines = []
        
    for year in tqdm(range(MIN_YEAR, MAX_YEAR+1)):
        for month in range(1, 13):
            for day in range(1, calendar.monthrange(year, month)[1] + 1):
                fp = FourPillar(True, year, month, day, 0, 0)
                meishiki = fp.get_str_four_pillar()
                del fp

                date_str = str(year) + "," + str(month) + "," +  str(day)
                meishiki_str = meishiki[2][0] + meishiki[2][1] + meishiki[1][0] + meishiki[1][1] + meishiki[0][0] + meishiki[0][1]
                if(len(meishiki) > 3):
                    meishiki_str += "," + meishiki[5][0] + meishiki[5][1] + meishiki[4][0] + meishiki[4][1] + meishiki[3][0] + meishiki[3][1]
                line = date_str + "," + meishiki_str + "\n"
                lines.append(line)

    f = open("meishiki_date.txt", "w", encoding="utf-8")
    f.writelines(lines)
    f.close()

    