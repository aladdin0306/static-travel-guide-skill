const PHOTOS = {
  "fj-gulangyu": ["Slyronit · CC BY-SA 4.0", "Gulangyu_Island_from_Zhongshan_Road,_Xiamen.jpg"],
  "fj-zhongshan": ["Slyronit · CC BY-SA 4.0", "Zhongshan_Road,_Xiamen_8.jpg"],
  "fj-nanputuo": ["Slyronit · CC BY-SA 4.0", "Nanputuo_Temple,_Xiamen_2.jpg"],
  "fj-kaiyuan": ["Tyg728 · CC BY-SA 4.0", "The_courtyard_of_Quanzhou_Kaiyuan_Temple_20170727.jpg"],
  "fj-weststreet": ["Tyg728 · CC BY-SA 4.0", "Renshou_pagoda_of_Quanzhou_Kaiyuan_Temple_20170727.jpg"],
  "fj-qingjing": ["Zhangzhugang · CC BY-SA 4.0", "Quanzhou_Qingjing_Si_20120229-03.jpg"],
  "fj-luoyang": ["N509FZ · CC BY-SA 4.0", "Luoyang_Bridge,_Quanzhou_(20201001150149).jpg"],
  "au-d1-opera": ["Bernard Spragg · CC0", "Sydney_Australia._(21339175489).jpg"],
  "au-d1-tour": ["Nick-D · CC BY-SA 3.0", "Sydney_Opera_House_concert_hall_October_2018.jpg"],
  "au-d2-gap": ["Dietmar Rabich · CC BY-SA 4.0", "Sydney_(AU),_Watsons_Bay_--_2019_--_2295.jpg"],
  "au-d3-manly": ["J Bar · CC BY-SA 3.0", "Shelly_Beach_Manly.JPG"],
  "au-d3-northhead": ["ColonelLight · CC0", "Burragula_Lookout_North_Head_02.jpg"],
  "au-d4-lagoon": ["Niki Gango · CC BY-SA 3.0", "Airlie_Beach_Lagoon.JPG"],
  "au-d5-sand": ["Slug69 · CC BY-SA 2.0", "Whitehaven_Beach,_Whitsunday_Island,_Queensland.jpg"],
  "au-d5-hill": ["Isderion · CC BY-SA 3.0 DE", "Hill_Inlet_at_the_end_of_Whitehaven_Beach_in_the_Whitsundays.JPG"],
  "au-d7-lanes": ["Ashton 29 · CC BY-SA 4.0", "Melbourne_laneway.jpg"],
  "au-d8-reb": ["Diliff, Ian Fieggen · CC BY 2.5", "Royal_exhibition_building_tulips_straight.jpg"],
  "au-d8-fitzroy": ["Nick-D · CC BY-SA 4.0", "Buildings_on_Gertrude_Street_December_2020.jpg"],
  "au-d8-convent": ["Redtree21 · CC BY-SA 4.0", "Abbotsford_Convent_Looking_North.jpg"],
  "au-d8-ngv": ["Shkuru Afshar · CC BY-SA 4.0", "National_Gallery_of_Victoria_2024.jpg"]
};

function photo(id) {
  const [credit, file] = PHOTOS[id];
  return { src: `photos/${id}.jpg`, credit, link: `https://commons.wikimedia.org/wiki/File:${file}` };
}

window.SEED_TRIPS = [
  {
    "id": "fujian-2027",
    "title": "厦门 · 泉州",
    "start": "2027-04-02",
    "end": "2027-04-06",
    "summary": "",
    "budget": {
      "currency": "CNY",
      "party": "两人同住一间",
      "basis": "每人，两人同住一间。按厦门进、泉州出的开口程估算，不走回头路；平日淡季机酒还能再省两三百。",
      "extras": [
        {
          "label": "市内打车与古城「小白」电瓶车",
          "cat": "transport",
          "amount": 160,
          "note": "厦门岛内短途网约车 + 泉州古城招手即停小白公交（¥2/次）。"
        },
        {
          "label": "日常茶饮咖啡与伴手礼零嘴",
          "cat": "food",
          "amount": 220,
          "note": "阿吉仔椰子饼、鲜榨芭乐汁、花生汤与四果汤等随手加餐。"
        }
      ],
      "origins": [
        {
          "id": "shanghai",
          "label": "上海",
          "cny": 1350,
          "brief": "去：4月2日早班虹桥/浦东直飞厦门高崎（约 2 小时，中午前进城）。回：4月6日傍晚泉州晋江机场直飞回上海（约 2 小时）。",
          "note": "开口程经济舱含税往返估 ¥1,200–1,500，按 ¥1,350 计。若节假日机票偏贵，也可改乘上海虹桥直达厦门/泉州的高铁（二等座往返约 ¥1,000，单程 5.5–6.5 小时）。",
          "adjust": []
        },
        {
          "id": "beijing",
          "label": "北京",
          "cny": 1850,
          "brief": "去：4月2日上午首都/大兴直飞厦门高崎（约 3 小时）。回：4月6日下午泉州晋江直飞北京大兴/首都（约 3 小时）。",
          "note": "开口程不走回头路，往返含税经济舱估 ¥1,600–2,100，按 ¥1,850 计。如果返程晋江机场时刻不合适，从泉州坐 28 分钟高铁回厦门高崎飞回北京班次极密。",
          "adjust": []
        }
      ]
    },
    "days": [
      {
        "id": "fj-d1",
        "date": "2027-04-02",
        "city": "厦门",
        "title": "落地思明老城，八市寻味与骑楼海景夜色",
        "items": [
          {
            "id": "fj-d1-arr",
            "time": "中午",
            "kind": "transport",
            "name": "落地厦门高崎机场，打车进思明老城区",
            "address": "厦门高崎国际机场",
            "lat": 24.544,
            "lng": 118.1277,
            "reservation": "none",
            "reservationNote": "高崎机场就在岛内，出航站楼直接按网约车上车点打车。",
            "bookingUrl": "",
            "cost": {
              "amount": 25,
              "note": "打车到中山路/思北约 ¥45–55，两人平摊每人约 ¥25。"
            },
            "note": "高崎机场去老城区只要 20–25 分钟。如果改坐高铁来厦门，优先买到岛内的「厦门站」，比岛外的厦门北站近得多。"
          },
          {
            "id": "fj-d1-stay",
            "time": "14:00",
            "kind": "stay",
            "name": "住中山路或思北路口周边（连住 2 晚）",
            "address": "厦门市思明区思明北路",
            "lat": 24.4552,
            "lng": 118.0815,
            "reservation": "required",
            "reservationNote": "小长假及周末房源紧，建议提前订可免费取消的骑楼精品酒店。",
            "bookingUrl": "https://hotels.ctrip.com/hotels/list?city=25&keyword=%E4%B8%AD%E5%B1%B1%E8%B7%AF",
            "cost": {
              "amount": 420,
              "note": "舒适型酒店每晚约 ¥380–460/间，两晚双人平摊每人约 ¥420。"
            },
            "why": "下楼就是南洋骑楼老街与八市菜场，去轮渡码头和沙坡尾打车都只要十分钟。",
            "note": "选思北路口、定安路或鹭江道外围大路边最方便，避开深巷石板路拖箱子费劲。"
          },
          {
            "id": "fj-d1-bashi",
            "time": "15:30–17:30",
            "kind": "sight",
            "name": "八市（第八海鲜市场）穿巷吃古早味小吃",
            "address": "厦门市思明区开禾路第八市场",
            "lat": 24.4586,
            "lng": 118.0789,
            "reservation": "none",
            "reservationNote": "街巷菜场全天开放，下午三四点小吃摊最齐。",
            "bookingUrl": "",
            "cost": {
              "amount": 45,
              "note": "五香条、手撕鸡、椰子饼与鲜榨果汁边走边吃人均约 ¥45。",
              "cat": "food"
            },
            "why": "老厦门烟火气最浓的百年海鲜菜场，沿街全是现炸五香条、满煎糕和刚出炉的马蹄酥。",
            "note": "从开禾路路口往里逛：阿杰五香现炸切段（¥4/条）、横竹路朱记手撕鸡、吉治百货楼下的阿吉仔买盒椰子饼当伴手礼；若在市场挑海鲜加工，一定先问清加工费和计价单位。"
          },
          {
            "id": "fj-d1-lujiang",
            "time": "18:00–19:15",
            "kind": "sight",
            "name": "演武大桥观景平台与鹭江道夜望鼓浪屿",
            "address": "厦门市思明区演武大桥观景平台",
            "lat": 24.4352,
            "lng": 118.0842,
            "reservation": "none",
            "reservationNote": "免费免预约，全天开放。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "紧贴海平面延伸进海湾的低矮栈桥，入夜后对岸鼓浪屿日光岩与老别墅灯火倒映海面。",
            "photo": photo("fj-gulangyu"),
            "note": "日落前半小时打车到演武大桥观景平台 3 号口，吹完海风看完美丽蓝调夜景，再顺海边回中山路吃晚饭。"
          },
          {
            "id": "fj-d1-dinner",
            "time": "19:30",
            "kind": "food",
            "name": "中山路骑楼老字号晚餐（沙茶面 · 鱼丸汤 · 姜母鸭）",
            "address": "厦门市思明区中山路步行街",
            "lat": 24.4533,
            "lng": 118.0785,
            "reservation": "none",
            "reservationNote": "老牌小吃店翻台快，现场点单即食。",
            "bookingUrl": "",
            "cost": {
              "amount": 70,
              "note": "加料沙茶面配鱼丸汤与半只砂锅姜母鸭，人均约 ¥70。"
            },
            "why": "浓稠醇香的花生蒜蓉沙茶汤头配鲜鱿鱼猪肝沿，再来一煲焦香入味的砂锅姜母鸭。",
            "photo": photo("fj-zhongshan"),
            "note": "避开步行街正中花哨的网红烤生蚝摊，往思北、局口街或大元路拐：四里沙茶面、邵子牙贡丸鱼丸汤、好德来姜母鸭都很稳，吃完顺着骑楼灯光溜达回酒店。"
          }
        ]
      },
      {
        "id": "fj-d2",
        "date": "2027-04-03",
        "city": "厦门",
        "title": "鼓浪屿万国建筑漫步，傍晚沙坡尾吹海风",
        "items": [
          {
            "id": "fj-d2-ferry",
            "time": "08:50–09:10",
            "kind": "transport",
            "name": "厦鼓码头乘船登鼓浪屿（三丘田码头下船）",
            "address": "厦门国际邮轮中心厦鼓码头",
            "lat": 24.4828,
            "lng": 118.0725,
            "reservation": "required",
            "reservationNote": "微信搜官方小程序「屿见厦门」提前 5–10 天抢上午 09:00 前后往三丘田码头的普通船票（¥35），别买高价黄牛套票。",
            "bookingUrl": "https://www.xmferry.com/",
            "cost": {
              "amount": 35,
              "note": "官方普通客船往返含返程共 ¥35/人。"
            },
            "note": "外地游客白天统一在东渡「厦鼓码头」刷身份证登船，航程约 20 分钟；首选「三丘田码头」下船，上岸走两步就是最美转角和精华建筑群。返程 20 天内不限班次。"
          },
          {
            "id": "fj-d2-villas",
            "time": "09:20–12:15",
            "kind": "sight",
            "name": "鼓浪屿老别墅巷弄与菽庄花园看海",
            "address": "厦门市思明区鼓浪屿港仔后路7号菽庄花园",
            "lat": 24.4429,
            "lng": 118.0672,
            "reservation": "none",
            "reservationNote": "菽庄花园门口直接扫码购票入园。",
            "bookingUrl": "",
            "cost": {
              "amount": 30,
              "note": "菽庄花园门票 ¥30（含钢琴博物馆）。"
            },
            "why": "钻进安静的红砖榕树小巷看百年南洋老洋房，在菽庄花园走贴着海浪的四十四桥。",
            "note": "下船趁早团未到先逛船屋、汇丰银行公馆旧址与协和礼拜堂，顺着海边路走到菽庄花园。全岛禁机动车全靠步行且上下坡多，务必穿软底好走的鞋。"
          },
          {
            "id": "fj-d2-lunch",
            "time": "12:30",
            "kind": "food",
            "name": "龙头路叶氏麻糍、海蛎煎与鲨鱼丸简餐",
            "address": "厦门市思明区鼓浪屿龙头路",
            "lat": 24.4475,
            "lng": 118.0686,
            "reservation": "none",
            "reservationNote": "沿街老铺随买随吃。",
            "bookingUrl": "",
            "cost": {
              "amount": 60,
              "note": "麻糍、闽南肠粉、海蛎煎配鱼丸汤人均约 ¥60。"
            },
            "why": "糯叽叽裹满黑白芝麻花生碎的手工麻糍，配一盘脆边海蛎煎和热鱼丸汤垫肚子。",
            "note": "龙头路三岔口的叶氏麻糍现包现卖；沈家闽南肠粉或林记木担鱼丸解决午饭很轻巧，留着肚子晚上回本岛吃正餐海鲜。"
          },
          {
            "id": "fj-d2-riguang",
            "time": "14:00–16:00",
            "kind": "sight",
            "name": "日光岩登顶俯瞰全岛，乘船返回本岛",
            "address": "厦门市思明区鼓浪屿晃岩路62号日光岩",
            "lat": 24.4446,
            "lng": 118.0654,
            "reservation": "none",
            "reservationNote": "现场或公众号扫码购票即可。",
            "bookingUrl": "",
            "cost": {
              "amount": 50,
              "note": "日光岩单点门票 ¥50。"
            },
            "why": "登上全岛最高处的巨石观景台，360 度收进整片红瓦绿树与对岸厦门双子塔海景。",
            "note": "午后攀登约 15 分钟石阶登顶。下山后回三丘田码头乘船离岛（17:40 前回厦鼓码头打车去沙坡尾；冬季 17:40 / 夏季 18:40 后可直接坐回中山路对面的轮渡码头）。"
          },
          {
            "id": "fj-d2-shapowei",
            "time": "16:45–18:30",
            "kind": "sight",
            "name": "沙坡尾避风坞与艺术西区日落散步",
            "address": "厦门市思明区沙坡尾避风坞",
            "lat": 24.4384,
            "lng": 118.0886,
            "reservation": "none",
            "reservationNote": "全天免费开放。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "月牙形老渔港停满木渔船，彩色老房子背后紧贴现代双子塔，傍晚海风与买手店都好逛。",
            "note": "绕着避风坞水岸走一圈，逛逛艺术西区里的独立陶器店和复古杂货铺，挑家临水小咖啡馆坐等落日。"
          },
          {
            "id": "fj-d2-seafood",
            "time": "19:00",
            "kind": "food",
            "name": "大学路闽南酱油水小海鲜大排档",
            "address": "厦门市思明区大学路",
            "lat": 24.4389,
            "lng": 118.0912,
            "reservation": "none",
            "reservationNote": "饭点热闹，18:30–19:00 到店通常稍等即有座。",
            "bookingUrl": "",
            "cost": {
              "amount": 110,
              "note": "点三四道当季小海鲜配炒面线，人均约 ¥100–120。"
            },
            "why": "沙坡尾隔壁就是本地人常聚的大学路老排档，一盘闽南招牌酱油水黄翅鱼鲜甜下饭。",
            "note": "大学路上的照强鸭肉海鲜、亚海大排档等都是明档看海鲜点菜，必试酱油水杂鱼、葱姜花蛤、紫菜海蛎煲，胆子大可以尝块冰镇土笋冻。"
          }
        ]
      },
      {
        "id": "fj-d3",
        "date": "2027-04-04",
        "city": "厦门 · 泉州",
        "title": "南普陀与环岛路看海，高铁 28 分钟进泉州古城",
        "items": [
          {
            "id": "fj-d3-nanputuo",
            "time": "08:30–10:15",
            "kind": "sight",
            "name": "南普陀寺晨间祈福与素饼",
            "address": "厦门市思明区思明南路515号南普陀寺",
            "lat": 24.4418,
            "lng": 118.0968,
            "reservation": "recommended",
            "reservationNote": "免费入寺，建议提前在微信「南普陀寺预约服务平台」约好早上入场时段。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "门票免费，入口可免费领一炷清香。"
            },
            "why": "背靠五老峰、紧邻厦大的千年古刹，大榕树与三角梅掩映下的红墙绿瓦清幽安静。",
            "photo": photo("fj-nanputuo"),
            "note": "早起趁凉快逛天王殿、大雄宝殿和法堂，顺后山石阶往上走十几分钟就能望见厦大绿琉璃屋顶与大海，出门别忘了买盒南普陀绿豆素饼（约 ¥15）。"
          },
          {
            "id": "fj-d3-huandao",
            "time": "10:30–12:15",
            "kind": "sight",
            "name": "环岛路（白城至黄厝海滩段）沿海骑行",
            "address": "厦门市思明区环岛南路黄厝海滨",
            "lat": 24.438,
            "lng": 118.151,
            "reservation": "none",
            "reservationNote": "海滨步道与单车道全天免费。",
            "bookingUrl": "",
            "cost": {
              "amount": 15,
              "note": "共享单车 + 路边冰椰青约 ¥15。"
            },
            "why": "厦门海水最蓝的一段椰林海岸线，顺着海边木栈道与慢行道迎风骑车特别舒展。",
            "note": "从南普陀外的白城海滩扫辆共享单车，一路往东骑过胡里山炮台外侧、音乐广场到黄厝海滩，找片礁石沙滩吹吹海风再打车回老城。"
          },
          {
            "id": "fj-d3-lunch",
            "time": "12:30",
            "kind": "food",
            "name": "同安封肉与闽南热芋包午餐",
            "address": "厦门市思明区大元路",
            "lat": 24.4564,
            "lng": 118.0796,
            "reservation": "none",
            "reservationNote": "随到随点。",
            "bookingUrl": "",
            "cost": {
              "amount": 60,
              "note": "同安封肉、芋包配清炒时蔬人均约 ¥60。"
            },
            "why": "筷子一戳就酥烂脱骨的红亮方块同安封肉配热气腾腾的鲜肉芋包，吃完刚好去坐高铁。",
            "note": "回酒店取行李前在老城区吃顿家常闽菜（如聪辉同安封肉或老牌芋包王），吃饱打车 15 分钟去厦门站。"
          },
          {
            "id": "fj-d3-hsr",
            "time": "14:15–14:45",
            "kind": "transport",
            "name": "高铁 厦门站 → 泉州站（约 28–35 分钟）",
            "address": "泉州火车站",
            "lat": 24.9746,
            "lng": 118.5322,
            "reservation": "required",
            "reservationNote": "12306 提前几天锁下午两三点「厦门站 → 泉州站」车次，节假日短途票也很抢手。",
            "bookingUrl": "https://www.12306.cn/",
            "cost": {
              "amount": 48,
              "note": "高铁二等座约 ¥33–38 + 出站打车进鲤城古城平摊 ¥12。"
            },
            "note": "认准「泉州站」（丰泽区北峰），离西街古城最近，打车约 20 分钟即到；别买到较远的泉州南站或泉州东站。"
          },
          {
            "id": "fj-d3-stay",
            "time": "15:30",
            "kind": "stay",
            "name": "住泉州西街或钟楼周边（连住 2 晚）",
            "address": "泉州市鲤城区西街钟楼",
            "lat": 24.9136,
            "lng": 118.5878,
            "reservation": "required",
            "reservationNote": "泉州古城周末及节假日一房难求，务必提前订好连住两晚。",
            "bookingUrl": "https://hotels.ctrip.com/hotels/list?city=406&keyword=%E8%A5%BF%E8%A1%97",
            "cost": {
              "amount": 360,
              "note": "古城精品酒店或红砖古厝民宿每晚约 ¥340–380/间，两晚平摊每人约 ¥360。"
            },
            "why": "住在鲤城古城正核心，出门步行就能逛开元寺和西街，招手即停「小白」公交串起全城古迹。",
            "note": "在泉州古城出门认准街上的白色电瓶公交「小白」，路边挥手即停或微信搜「小白约租」呼叫，古城内到哪一律 ¥2/人，省力又好玩。"
          },
          {
            "id": "fj-d3-rooftop",
            "time": "16:45–18:15",
            "kind": "sight",
            "name": "西街天台平视开元寺双塔日落",
            "address": "泉州市鲤城区西街",
            "lat": 24.9158,
            "lng": 118.5847,
            "reservation": "none",
            "reservationNote": "买杯饮品即可上天台座位。",
            "bookingUrl": "",
            "cost": {
              "amount": 32,
              "note": "天台茶饮或咖啡人均约 ¥28–35。"
            },
            "why": "端杯冰芭乐茶坐在红砖骑楼老屋顶上，平视宋代东西双石塔被夕阳染成暖金色。",
            "photo": photo("fj-weststreet"),
            "note": "西街中段的莓超疯天台、有鲤天台咖啡或橘若天台机位都很正，下午四点半后上去不晒，静静等五点半的落日余晖与钟楼亮灯。"
          },
          {
            "id": "fj-d3-dinner",
            "time": "18:30–20:30",
            "kind": "food",
            "name": "水门国仔面线糊配醋肉 + 古厝南音夜场",
            "address": "泉州市鲤城区美食街或中山中路",
            "lat": 24.9102,
            "lng": 118.5855,
            "reservation": "recommended",
            "reservationNote": "面线糊随到随吃；若想看泉州提线木偶剧院演出，需提前在「泉州市提线木偶戏传承保护中心」公众号抢票。",
            "bookingUrl": "",
            "cost": {
              "amount": 85,
              "note": "加料面线糊约 ¥35 + 南音茶馆听曲茶位约 ¥50。"
            },
            "why": "清甜滑顺的骨汤面线糊剪段酥油条和现炸醋肉，饭后钻进古厝茶馆听一场千年南音。",
            "note": "面线糊加料推荐卤大肠、醋肉、海蛎和油条；晚饭后步行去府文庙旁的泉州南音艺苑或金鱼巷古厝茶馆听一小时南音雅乐，慢慢散步回酒店。"
          }
        ]
      },
      {
        "id": "fj-d4",
        "date": "2027-04-05",
        "city": "泉州",
        "title": "开元寺千年香火、涂门街半城神仙与蟳埔簪花",
        "items": [
          {
            "id": "fj-d4-kaiyuan",
            "time": "08:30–10:30",
            "kind": "sight",
            "name": "开元寺（大雄宝殿飞天乐伎 · 东西塔 · 千年古桑）",
            "address": "泉州市鲤城区西街176号开元寺",
            "lat": 24.9173,
            "lng": 118.5815,
            "reservation": "none",
            "reservationNote": "免费免预约直接入寺。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "福建规模最大的唐宋古刹，大殿斗拱上悬着二十四尊妙音鸟木雕，院中两座南宋石塔巍峨古朴。",
            "photo": photo("fj-kaiyuan"),
            "note": "早上八点半红墙树影最美，一定抬头看大雄宝殿内的二十四尊飞天乐伎（迦陵频伽）木雕斗拱，再绕去殿后看唐代古桑树、甘露戒坛，以及镇国塔与仁寿塔底座石雕。"
          },
          {
            "id": "fj-d4-tumen",
            "time": "10:45–12:10",
            "kind": "sight",
            "name": "象峰巷穿巷 → 清净寺与通淮关岳庙",
            "address": "泉州市鲤城区涂门街108号清净寺",
            "lat": 24.9062,
            "lng": 118.5916,
            "reservation": "none",
            "reservationNote": "清净寺门口买 ¥3 门票（着装需过肩过膝）；关岳庙免费。",
            "bookingUrl": "",
            "cost": {
              "amount": 3,
              "note": "清净寺门票 ¥3。"
            },
            "why": "同一条涂门街上并排立着宋代阿拉伯花岗岩清真寺遗址与青烟缭绕、满顶剪瓷雕的关岳庙。",
            "photo": photo("fj-qingjing"),
            "note": "出开元寺钻进对面象峰巷拍石塔老街同框，招辆小白（¥2）到涂门街：先看 1009 年始建的清净寺尖拱石门与奉天坛遗迹，再往东走两百米去香火鼎盛的通淮关岳庙抬头看繁复华丽的彩色剪瓷雕屋脊。"
          },
          {
            "id": "fj-d4-duck",
            "time": "12:20",
            "kind": "food",
            "name": "涂门街斯丹姜母鸭配花肠汤午餐",
            "address": "泉州市鲤城区涂门街百源路交叉口",
            "lat": 24.9073,
            "lng": 118.5902,
            "reservation": "none",
            "reservationNote": "饭点人多可取号，翻台很快。",
            "bookingUrl": "",
            "cost": {
              "amount": 75,
              "note": "一只姜母鸭配鸭血、青菜和花肠汤，两人平摊每人约 ¥75。"
            },
            "why": "泉州派盐烧姜母鸭干香浓郁，老姜片煸得酥香入骨，配碗清甜猪花肠汤刚好解腻。",
            "note": "总店就在关岳庙斜对面百源路口，鸭肉焖得软烂脱骨，如果喜欢打包伴手礼也可以在店里直接真空封袋寄走。"
          },
          {
            "id": "fj-d4-xunpu",
            "time": "14:30–17:45",
            "kind": "sight",
            "name": "蟳埔民俗渔村（体验簪花围 · 看百年蚝壳厝）",
            "address": "泉州市丰泽区蟳埔村",
            "lat": 24.8672,
            "lng": 118.6653,
            "reservation": "none",
            "reservationNote": "村落免费开放，簪花小铺满村都是，随到随盘。",
            "bookingUrl": "",
            "cost": {
              "amount": 40,
              "note": "传统阿嬷鲜花簪花围 + 借一套大裾衫服饰统一约 ¥40。"
            },
            "why": "灰白色大生蚝壳砌满整面红砖外墙的海边老渔村，盘一头鲜艳四季鲜花穿梭巷弄超出片。",
            "note": "从古城打车约 20 分钟直达。认准本地阿嬷手盘的真鲜花簪花围（约 ¥40 封顶，不必花几百块订商业旅拍套餐），往顺济宫与老巷深处走，能看到保存完好的百年生蚝壳墙老宅。"
          },
          {
            "id": "fj-d4-dinner",
            "time": "18:30",
            "kind": "food",
            "name": "好成财牛排馆 + 秉正堂石花膏四果汤",
            "address": "泉州市鲤城区涂门街221号",
            "lat": 24.9066,
            "lng": 118.5888,
            "reservation": "none",
            "reservationNote": "随到随点，快餐式出餐极快。",
            "bookingUrl": "",
            "cost": {
              "amount": 65,
              "note": "牛排套餐配咸饭牛杂汤约 ¥50 + 秉正堂四果汤 ¥15。"
            },
            "why": "微带南洋药膳咖喱香的软烂带骨牛排配萝卜咸饭，饭后再端一碗冰凉清甜的四果汤收尾。",
            "note": "泉州的「牛排」不是西餐铁板牛排，而是源自南洋香料慢炖的厚切牛肋排，蘸点甜辣酱配花生咸饭绝配；吃完过马路去天后宫或涂门街秉正堂总店来碗石花膏四果汤。"
          }
        ]
      },
      {
        "id": "fj-d5",
        "date": "2027-04-06",
        "city": "泉州",
        "title": "天后宫早市烟火，逛梧林南洋侨村后返程",
        "altTitle": "搭高铁返程备选：不去南边的晋江梧林，改去城东北宋代跨海洛阳古桥",
        "items": [
          {
            "id": "fj-d5-tianhou",
            "time": "09:00–11:00",
            "kind": "sight",
            "name": "天后宫、德济门遗址与车桥头水丸汤早餐",
            "address": "泉州市鲤城区南门天后路1号泉州天后宫",
            "lat": 24.8965,
            "lng": 118.5861,
            "reservation": "none",
            "reservationNote": "免费开放。",
            "bookingUrl": "",
            "cost": {
              "amount": 25,
              "note": "水丸汤配花生汤油条早点人均约 ¥25。",
              "cat": "food"
            },
            "why": "城南老泉州人日常赶早市的妈祖祖庙街区，比西街清静得多，早起喝碗弹牙手工水丸配花生汤。",
            "note": "坐小白到城南天后宫，看海内外现存规格最高的宋代妈祖庙与门外元代德济门遗址；顺着聚宝街走到车桥头文阿水丸店解决地道早饭。"
          },
          {
            "id": "fj-d5-wulin",
            "time": "11:30–14:30",
            "kind": "sight",
            "name": "晋江梧林传统村落（红砖古厝与南洋番仔楼）",
            "address": "泉州市晋江市新塘街道梧林传统村落",
            "lat": 24.7578,
            "lng": 118.5794,
            "reservation": "none",
            "reservationNote": "村落免费开放，游客中心可免费寄存大件行李。",
            "bookingUrl": "",
            "cost": {
              "amount": 45,
              "note": "打车前往平摊约 ¥20 + 村口闽南卤面简餐 ¥25。"
            },
            "why": "百年华侨回乡修筑的闽南红砖大厝、哥特式洋楼与罗马式枪楼聚在一片田园里，距晋江机场仅 20 分钟。",
            "note": "退房带上箱子打车南下约 30 分钟即达，先把行李寄存在游客中心。重点逛朝东楼、五层厝、修养楼和古厝书局，在榕树下喝杯南洋咖啡，下午直接打车去晋江机场最顺路。"
          },
          {
            "id": "fj-d5-luoyang",
            "alt": true,
            "time": "11:30–14:30",
            "kind": "sight",
            "name": "洛阳桥（中国四大古桥之一 · 北宋跨海梁式石桥）",
            "address": "泉州市洛江区桥南街洛阳桥",
            "lat": 24.9547,
            "lng": 118.6778,
            "reservation": "none",
            "reservationNote": "古桥全天免费开放。",
            "bookingUrl": "",
            "cost": {
              "amount": 40,
              "note": "打车往返平摊与桥南简餐约 ¥40。"
            },
            "why": "北宋蔡襄主持修建的近千米跨海花岗岩古桥，尖劈船形桥墩用牡蛎固基，退潮时满滩红树林。",
            "photo": photo("fj-luoyang"),
            "note": "如果回程买的是「泉州站」出发的高铁，去城东北的洛阳桥比南下晋江更顺。先逛桥南古街与蔡襄祠，再踏上千年大石板桥面走到中亭吹江海交汇处的风。"
          },
          {
            "id": "fj-d5-dep",
            "time": "15:00",
            "kind": "transport",
            "name": "前往泉州晋江国际机场（或泉州高铁站）返程",
            "address": "泉州晋江国际机场",
            "lat": 24.7964,
            "lng": 118.59,
            "reservation": "none",
            "reservationNote": "",
            "bookingUrl": "",
            "cost": {
              "amount": 20,
              "note": "从梧林打车去晋江机场约 15–20 分钟，平摊每人约 ¥20。"
            },
            "note": "晋江机场航站楼紧凑好走、安检很快，国内航班提前 1.5 小时抵达就非常从容。"
          }
        ]
      }
    ]
  },
  {
    "id": "australia-2027",
    "title": "澳洲",
    "start": "2027-04-29",
    "end": "2027-05-05",
    "summary": "",
    "visa": {
      "status": "required",
      "passport": "中国大陆护照",
      "type": "Visitor visa (subclass 600) · Tourist stream",
      "applyUrl": "https://online.immi.gov.au/lusc/login",
      "guideUrl": "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
      "feeNote": "约 A$250/人（以官网实时费用为准）",
      "timeline": "建议出发前 6–8 周递交；旺季更早",
      "docs": [
        {
          "id": "passport",
          "label": "护照有效期覆盖行程",
          "note": "建议剩余有效期 6 个月以上"
        },
        {
          "id": "photo",
          "label": "签证用近照"
        },
        {
          "id": "itinerary",
          "label": "行程与酒店预订单",
          "note": "可用本页「打印 / 导出 PDF 路书」"
        },
        {
          "id": "funds",
          "label": "资金证明",
          "note": "近几个月银行流水等"
        },
        {
          "id": "employment",
          "label": "在职或学生证明"
        }
      ],
      "tips": [
        "填表信息与护照、材料保持一致",
        "不要把护照号、签证申请号写进本页或云端共享"
      ],
      "disclaimer": "政策、费用与审理时间以移民局官网为准；本页只作出行准备清单，不构成签证代理或获批承诺。"
    },
    "budget": {
      "currency": "AUD",
      "party": "两人同住一间",
      "basis": "每人，两人同住一间。价格是 2026年10月查的，机票和酒店按淡季中间价估。",
      "cnyRate": 4.68,
      "rateDate": "2026-10-08",
      "extras": [
        {
          "label": "澳洲旅游签证（600 类）",
          "cat": "other",
          "amount": 250,
          "note": "中国护照在国外递交，2026年7月起每人 A$250。"
        },
        {
          "label": "其余三餐和咖啡",
          "cat": "food",
          "amount": 455,
          "note": "上面没单列的早饭和午饭，每天大约 A$65，7 天。"
        },
        {
          "label": "手机流量卡",
          "cat": "other",
          "amount": 30,
          "note": "落地在机场或超市买预付卡。"
        }
      ],
      "origins": [
        {
          "id": "beijing",
          "label": "北京",
          "cny": 7000,
          "brief": "去：4月28日深夜到首都机场，29日 01:40 国航 CA173 直飞悉尼，14:50 到。回：5月5日 19:40 国航 CA166 墨尔本直飞北京首都，6日 05:45 到。",
          "note": "经济舱含税开口程，估 ¥6,000–8,000，按 ¥7,000 算。CA173 按 2026 年班期是周二、四、六、日，4月29日周四有班。想上午就到悉尼，可以 28日先飞上海转 20:20 的东航 MU561，29日 09:00 到。5月5日上午逛植物园，下午三点前回酒店拿行李，四点前上 SkyBus。",
          "adjust": []
        },
        {
          "id": "shanghai",
          "label": "上海",
          "cny": 6000,
          "brief": "去：4月28日（周三）18:25 吉祥 HO1669 浦东直飞悉尼，29日 06:15 左右到。回：5月5日（周三）08:00 吉祥 HO1656 墨尔本直飞浦东，16:20 到，票买到温州，在浦东下飞机不坐后段。",
          "note": "经济舱含税，估 ¥5,000–7,000，按 ¥6,000 算，出票后改成实际价格。时间按 2026 年冬季班期，2027 年出了再核对。回程甩尾要注意：只带手提行李，托运的箱子会直挂到温州；回程必须是这张票的最后一段，不坐的只能是浦东到温州那段；吉祥条款不允许不按顺序乘坐，可能被要求补差价，会员里程别累积到这张票。HO1656 早上 8 点飞，5月5日凌晨 4:30 前就要上 SkyBus。",
          "adjust": []
        }
      ]
    },
    "days": [
      {
        "id": "au-d1",
        "date": "2027-04-29",
        "city": "悉尼",
        "title": "落地悉尼，海港渡轮与歌剧院日落",
        "items": [
          {
            "id": "au-d1-opal",
            "time": "落地后",
            "kind": "transport",
            "name": "机场火车 T8 直达环形码头",
            "address": "Sydney Airport International Station",
            "lat": -33.9344,
            "lng": 151.1652,
            "reservation": "none",
            "reservationNote": "不用提前买票，直接刷 Visa / Mastercard 信用卡或 Opal 卡进站。",
            "bookingUrl": "",
            "cost": {
              "amount": 22.94,
              "note": "含机场站通行费 A$18.61 + 进城车资，合计约 A$22.94。"
            },
            "note": "国际航站楼和国内航站楼各有一个火车站。跟着 Train 指示牌下楼坐 T8 进城方向，在 Circular Quay（环形码头）下车即可。如果行李多或飞太累，也可以直接打车进城，车程约 30–40 分钟。"
          },
          {
            "id": "au-d1-stay",
            "time": "入住",
            "kind": "stay",
            "name": "住环形码头或岩石区（连住 2 晚）",
            "address": "Circular Quay, Sydney",
            "lat": -33.8612,
            "lng": 151.2108,
            "reservation": "required",
            "reservationNote": "海港边位置好的酒店抢手，建议提前连订两晚；上午落地可先把行李寄存在前台。",
            "bookingUrl": "https://www.booking.com/searchresults.html?ss=Circular+Quay%2C+Sydney&checkin=2027-04-29&checkout=2027-05-01",
            "cost": {
              "amount": 330,
              "note": "四星酒店每晚约 A$300–350/间，两晚双人平摊每人约 A$330。"
            },
            "why": "下楼就能走到歌剧院、岩石区和渡轮码头，前两天坐船出门最省力。",
            "note": "今明两天去沃森斯湾和曼利海滩都在环形码头上船，住这一片不用反复换乘。"
          },
          {
            "id": "au-d1-watsons",
            "time": "早到再去",
            "kind": "sight",
            "name": "渡轮去沃森斯湾与 The Gap 海崖",
            "address": "Gap Park, Watsons Bay",
            "lat": -33.8452,
            "lng": 151.287,
            "reservation": "none",
            "reservationNote": "渡轮直接刷卡上船，海崖公园免费。",
            "bookingUrl": "",
            "cost": {
              "amount": 14.7,
              "note": "往返渡轮单程各 A$7.35。"
            },
            "why": "内港一侧是安静小渔村，翻过草坡就是太平洋巨浪拍岸的断崖，来回坐船很轻松。",
            "photo": photo("au-d2-gap"),
            "note": "如果搭早班机上午就到悉尼，放好行李去环形码头 2 号码头坐 F9 渡轮（约 25 分钟）。下船穿过草坪走上 Gap Park 看外海悬崖，往返步行只要 20 分钟；若下午才落地悉尼，就跳过这站直接去歌剧院散步。"
          },
          {
            "id": "au-d1-opera",
            "time": "傍晚",
            "kind": "sight",
            "name": "悉尼歌剧院与麦考利夫人石椅散步",
            "address": "Bennelong Point, Sydney NSW",
            "lat": -33.8568,
            "lng": 151.2153,
            "reservation": "none",
            "reservationNote": "户外海滨步道全天免费。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "顺着海港栈道慢走到白帆脚下，再进皇家植物园拍歌剧院与海港大桥同框日落。",
            "photo": photo("au-d1-opera"),
            "note": "从环形码头沿海边散步过去只要几分钟。看完美丽的贝壳屋顶，如果体力还行，继续往东穿过皇家植物园走 20 分钟到 Mrs Macquarie's Chair，傍晚光线最出片。"
          },
          {
            "id": "au-d1-tour",
            "time": "想进去再订",
            "kind": "sight",
            "name": "悉尼歌剧院中文/英文入内导览",
            "address": "Sydney Opera House Welcome Centre",
            "lat": -33.8568,
            "lng": 151.2153,
            "reservation": "recommended",
            "reservationNote": "官网提前买比现场便宜 A$5；每场限约 35 人，迟到超 5 分钟无法入场。",
            "bookingUrl": "https://www.sydneyoperahouse.com/tours/sydney-opera-house-tour",
            "cost": {
              "amount": 52,
              "note": "官网提前订每人约 A$52。"
            },
            "why": "由讲解员带着走进风帆内部看木质音乐厅结构，团小安静。",
            "photo": photo("au-d1-tour"),
            "note": "想看内部建筑再订即可，选傍晚前最后一场，提前 15 分钟到下层 Welcome Centre 集合。"
          },
          {
            "id": "au-d1-bar",
            "time": "晚饭",
            "kind": "food",
            "name": "Opera Bar 海景晚餐",
            "address": "Lower Concourse, Sydney Opera House",
            "lat": -33.8583,
            "lng": 151.2142,
            "reservation": "none",
            "reservationNote": "现场找位置入座，不接受预订。",
            "bookingUrl": "",
            "cost": {
              "amount": 60,
              "note": "一份主菜配一杯酒水人均约 A$50–70。"
            },
            "why": "就在歌剧院正下方的露天水岸餐吧，正对海港大桥夜景。",
            "note": "日落前后靠水边的桌子最抢手，逛完歌剧院直接下楼坐下吃顿简餐喝一杯，吃完溜达回酒店早点睡。"
          }
        ]
      },
      {
        "id": "au-d3",
        "date": "2027-04-30",
        "city": "悉尼",
        "title": "渡轮去曼利海滩，徒步北角悬崖",
        "items": [
          {
            "id": "au-d3-ferry",
            "time": "10:00",
            "kind": "transport",
            "name": "F1 渡轮前往曼利码头",
            "address": "Circular Quay Wharf 3",
            "lat": -33.8612,
            "lng": 151.2108,
            "reservation": "none",
            "reservationNote": "直接刷信用卡或 Opal 卡进闸。",
            "bookingUrl": "",
            "cost": {
              "amount": 9.65,
              "note": "周五全天公共交通封顶 A$9.65，往返渡轮与公交都含在内。"
            },
            "note": "在环形码头 3 号码头坐 F1 Manly，航程约 30 分钟。挑上层甲板外侧坐，一路驶过歌剧院和海港大桥，海风大记得带件外套。"
          },
          {
            "id": "au-d3-manly",
            "time": "10:40",
            "kind": "sight",
            "name": "曼利海滩与 Shelly Beach 海滨步道",
            "address": "Shelly Beach, Manly",
            "lat": -33.8003,
            "lng": 151.2975,
            "reservation": "none",
            "reservationNote": "免费开放。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "穿过冲浪海滩顺着礁石海边栈道往南走一公里，就是风平浪静的朝北小海湾。",
            "photo": photo("au-d3-manly"),
            "note": "下船穿过 The Corso 步行街时先买好三明治和饮用水带上（后面北角山上没有商店和餐厅），走到主海滩右转沿着海边步道慢走到 Shelly Beach。"
          },
          {
            "id": "au-d3-northhead",
            "time": "11:30",
            "kind": "sight",
            "name": "北角 Fairfax 悬崖观景台",
            "address": "Fairfax Lookout, North Head Scenic Drive, Manly",
            "lat": -33.8167,
            "lng": 151.2963,
            "reservation": "none",
            "reservationNote": "国家公园免费进入。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "站在高耸海岬上回望整座悉尼港入口与城市天际线，5 月初还常能遇到迁徙的鲸鱼。",
            "photo": photo("au-d3-northhead"),
            "note": "从 Shelly Beach 停车场后方的林间步道爬升约 80 米上山，跟着路牌走到 Fairfax Lookout 环形栈道，刚好在悬崖边野餐吃午饭。"
          },
          {
            "id": "au-d3-bus",
            "time": "14:30",
            "kind": "transport",
            "name": "161 路公交回曼利码头",
            "address": "North Fort, North Head Scenic Drive",
            "lat": -33.8133,
            "lng": 151.2925,
            "reservation": "none",
            "reservationNote": "上车刷卡。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "已含在周五封顶车资里。"
            },
            "note": "在 North Fort 停车场坐 161 路下山回码头（约半小时一班）；如果不想等车，顺步道一路下坡走回去也只要 3 公里。"
          },
          {
            "id": "au-d3-back",
            "time": "15:30",
            "kind": "transport",
            "name": "渡轮返回环形码头",
            "address": "Manly Wharf",
            "lat": -33.8001,
            "lng": 151.284,
            "reservation": "none",
            "reservationNote": "",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "已含在当天封顶里。"
            },
            "note": "坐 F1 渡轮迎着夕阳光线回环形码头，下船往西走两步就是岩石区。"
          },
          {
            "id": "au-d3-rocks",
            "time": "16:45–19:30",
            "kind": "food",
            "name": "岩石区（The Rocks）石板老街漫步与海港晚餐",
            "address": "The Rocks, Sydney NSW",
            "lat": -33.8599,
            "lng": 151.209,
            "reservation": "none",
            "reservationNote": "历史老酒馆与露天餐座随到随坐。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "餐费已计入每日三餐预算。"
            },
            "why": "海港大桥正下方的百年砂岩老街区，傍晚逛手工小店，再找家百年酒馆露台吃牛排或炸鱼薯条。",
            "note": "从环形码头西侧步行 5 分钟即达。The Glenmore 顶层露台正好平视歌剧院夜景，吃完慢慢走回酒店收拾行李，准备明早飞圣灵群岛。"
          }
        ]
      },
      {
        "id": "au-d4",
        "date": "2027-05-01",
        "city": "圣灵群岛",
        "title": "飞抵艾尔利海滩，泻湖看海",
        "items": [
          {
            "id": "au-d4-flight",
            "time": "早上",
            "kind": "transport",
            "name": "悉尼直飞普罗瑟派恩（PPP）",
            "address": "Whitsunday Coast Airport PPP",
            "lat": -20.495,
            "lng": 148.552,
            "reservation": "required",
            "reservationNote": "正逢昆士兰劳动节长周末首日，早点锁中午前后落地的直飞航班。",
            "bookingUrl": "https://www.google.com/travel/flights?hl=zh-CN&q=One%20way%20flights%20from%20Sydney%20to%20Proserpine%20on%20May%201%202027",
            "cost": {
              "amount": 260,
              "note": "捷星直飞含一件托运行李约 A$220–290。"
            },
            "note": "白天堂沙滩的一日游快艇大多从艾尔利海滩发船，所以飞大陆侧的 PPP（Whitsunday Coast）机场最顺，航程约 2.5 小时。"
          },
          {
            "id": "au-d4-shuttle",
            "time": "落地后",
            "kind": "transport",
            "name": "机场接驳巴士前往艾尔利海滩",
            "address": "Airlie Beach",
            "lat": -20.2676,
            "lng": 148.7166,
            "reservation": "recommended",
            "reservationNote": "巴士按航班时间发车，提前在网上订好座位最稳。",
            "bookingUrl": "https://www.whitsundaytransit.com.au/",
            "cost": {
              "amount": 22,
              "note": "单程约 A$22。"
            },
            "note": "上车报酒店名字即可直接送到门口，车程约 35–40 分钟。"
          },
          {
            "id": "au-d4-stay",
            "time": "入住",
            "kind": "stay",
            "name": "住艾尔利海滩主街或 Coral Sea 码头旁（连住 2 晚）",
            "address": "Airlie Beach QLD",
            "lat": -20.2682,
            "lng": 148.7172,
            "reservation": "required",
            "reservationNote": "昆士兰劳动节小长假期间海边房源紧俏，尽早预订。",
            "bookingUrl": "https://www.booking.com/searchresults.html?ss=Airlie+Beach&checkin=2027-05-01&checkout=2027-05-03",
            "cost": {
              "amount": 280,
              "note": "每晚约 A$250–300/间，两晚双人平摊每人约 A$280。"
            },
            "why": "出门就是海滨主街和游艇码头，第二天一早溜达着就能去登船出海。",
            "note": "认准 Airlie Beach 镇中心或 Coral Sea Marina 周边，千万别订到内陆的 Proserpine 镇上。"
          },
          {
            "id": "au-d4-lagoon",
            "time": "下午",
            "kind": "sight",
            "name": "艾尔利海滨泻湖泳池（Airlie Beach Lagoon）",
            "address": "Airlie Beach Lagoon",
            "lat": -20.2692,
            "lng": 148.7188,
            "reservation": "none",
            "reservationNote": "免费公共设施。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "紧贴珊瑚海的露天无边泻湖，不用穿防刺服就能安全泡水晒太阳。",
            "photo": photo("au-d4-lagoon"),
            "note": "5 月初外海仍有水母需穿防刺服，在镇中心的泻湖泳池可以直接下水游泳，旁边草坪躺着看海非常惬意。"
          }
        ]
      },
      {
        "id": "au-d5",
        "date": "2027-05-02",
        "city": "圣灵群岛",
        "title": "出海：白天堂沙滩与希尔湾观景台",
        "altTitle": "备选船型：怕快艇颠簸可改订 Lady Enid 复古木帆船",
        "items": [
          {
            "id": "au-d5-raft",
            "time": "08:45–15:30",
            "kind": "sight",
            "name": "Ocean Rafting 快艇一日游（Northern Exposure 线）",
            "address": "Coral Sea Marina, Airlie Beach",
            "lat": -20.267,
            "lng": 148.7135,
            "reservation": "required",
            "reservationNote": "整趟行程最抢手的一项，务必提前锁 Northern Exposure 线（只订半日游去不了希尔湾观景台）。",
            "bookingUrl": "https://www.oceanrafting.com.au/",
            "cost": {
              "amount": 249,
              "note": "成人 A$249，含自助简餐、浮潜装备、防刺服和镇上接送。"
            },
            "why": "半敞篷快艇船小速度快，能赶在大批游船抵达前先登上观景台和白沙滩。",
            "note": "认准 Coral Sea Marina 北码头集合（别跑去另一头的 Port of Airlie），提前 30 分钟签到。带好泳衣、浴巾、防晒霜和一双好走的凉鞋，容易晕船的话开船前半小时先吃晕船药。"
          },
          {
            "id": "au-d5-enid",
            "alt": true,
            "time": "08:00–17:30",
            "kind": "sight",
            "name": "Lady Enid 复古木帆船一日游",
            "address": "Coral Sea Marina, Airlie Beach",
            "lat": -20.2682,
            "lng": 148.7172,
            "reservation": "recommended",
            "reservationNote": "与上面的快艇二选一即可；仅接待 18 岁以上成人，限载 24 人。",
            "bookingUrl": "https://www.australiancruisegroup.com.au/whitsundays/whitehaven-beach-cruises/10hr-lady-enid-whitehaven-beach-sail-snorkel-cruise",
            "cost": {
              "amount": 295,
              "note": "每人 A$295（含早午茶点与浮潜，比快艇贵 A$46）。"
            },
            "why": "1962 年的经典木帆船，航行平稳安静，同样包含希尔湾观景台和白天堂沙滩。",
            "note": "全程约 9.5 小时，适合不想坐高速快艇颠簸、想在甲板上慢慢吹海风看海的节奏。"
          },
          {
            "id": "au-d5-hill",
            "time": "上午",
            "kind": "sight",
            "name": "希尔湾观景台（Hill Inlet Lookout）",
            "address": "Hill Inlet Lookout, Whitsunday Island",
            "lat": -20.2597,
            "lng": 149.0378,
            "reservation": "none",
            "reservationNote": "已含在出海行程内。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "含在船票里。"
            },
            "why": "纯白沙洲与蒂芙尼蓝海水随潮汐交织成流沙漩涡，圣灵群岛最震撼的俯瞰机位。",
            "photo": photo("au-d5-hill"),
            "note": "快艇停靠 Tongue Bay 后，跟着向导走 15 分钟林间木栈道登上观景台。"
          },
          {
            "id": "au-d5-sand",
            "time": "中午",
            "kind": "sight",
            "name": "白天堂沙滩（Whitehaven Beach）",
            "address": "Whitehaven Beach, Whitsunday Island",
            "lat": -20.282,
            "lng": 149.0375,
            "reservation": "none",
            "reservationNote": "已含在出海行程内。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "含在船票里。"
            },
            "why": "绵延 7 公里的 98% 纯白硅砂海滩，赤脚踩上去细腻不烫脚。",
            "photo": photo("au-d5-sand"),
            "note": "岛上属于国家公园保护区，没有任何商店，也不能带走沙子。下午回港后在艾尔利主街吃海鲜，早点把箱子收好准备明早飞墨尔本。"
          }
        ]
      },
      {
        "id": "au-d7",
        "date": "2027-05-03",
        "city": "墨尔本",
        "title": "飞抵墨尔本，穿梭涂鸦咖啡小巷",
        "items": [
          {
            "id": "au-d7-flight",
            "time": "上午",
            "kind": "transport",
            "name": "普罗瑟派恩直飞墨尔本 JQ833",
            "address": "Melbourne Airport",
            "lat": -37.669,
            "lng": 144.841,
            "reservation": "required",
            "reservationNote": "每天仅一班捷星直飞（约 3 小时），小长假返程票紧，建议最先锁定。",
            "bookingUrl": "https://www.google.com/travel/flights?hl=zh-CN&q=One%20way%20flights%20from%20Proserpine%20to%20Melbourne%20on%20May%203%202027",
            "cost": {
              "amount": 322,
              "note": "直飞机票含托运约 A$300 + 去 PPP 机场的接驳巴士 A$22。"
            },
            "note": "提前一天约好从艾尔利海滩去机场的大巴（车程约 40 分钟），按起飞前 2 小时到机场预留。"
          },
          {
            "id": "au-d7-sky",
            "time": "落地后",
            "kind": "transport",
            "name": "SkyBus 机场快线直达南十字星站",
            "address": "Southern Cross Station, Melbourne",
            "lat": -37.8184,
            "lng": 144.9525,
            "reservation": "none",
            "reservationNote": "随到随坐，现场扫码或刷卡买票。",
            "bookingUrl": "https://www.skybus.com.au/",
            "cost": {
              "amount": 43.4,
              "note": "直接买往返套票 A$43.40（比买两次单程省 A$8.40，回程通用）。"
            },
            "note": "走出航站楼就能看到红色 SkyBus 双层大巴，约 30–40 分钟直达市中心 Southern Cross 车站。"
          },
          {
            "id": "au-d7-stay",
            "time": "入住",
            "kind": "stay",
            "name": "住弗林德斯街或南十字星站周边（连住 2 晚）",
            "address": "Flinders Street, Melbourne",
            "lat": -37.8183,
            "lng": 144.9671,
            "reservation": "required",
            "reservationNote": "连住 5 月 3–5 日两晚，选在免费电车区（Free Tram Zone）内最方便。",
            "bookingUrl": "https://www.booking.com/searchresults.html?ss=Flinders+Street+Melbourne&checkin=2027-05-03&checkout=2027-05-05",
            "cost": {
              "amount": 240,
              "note": "市中心四星每晚约 A$200–260/间，两晚双人平摊每人约 A$240。"
            },
            "why": "出门在市中心坐电车全免费，去涂鸦巷和返程搭机场大巴都在步行圈内。",
            "note": "若最后一天搭早班机回国，提前一晚把行李收拾妥当；若搭晚班机，退房后把箱子寄存在前台即可轻松再逛半天。"
          },
          {
            "id": "au-d7-lanes",
            "time": "傍晚",
            "kind": "sight",
            "name": "Degraves St 与 Flinders Lane 咖啡涂鸦小巷",
            "address": "Centre Place, Melbourne",
            "lat": -37.816,
            "lng": 144.9653,
            "reservation": "none",
            "reservationNote": "全天免费。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "比游客扎堆的 Hosier Lane 更有味道，窄巷两侧挤满露天咖啡座、独立小店与街头壁画。",
            "photo": photo("au-d7-lanes"),
            "note": "从弗林德斯街车站对面钻进 Degraves Street 和 Centre Place，再顺着 Flinders Lane 一路往东慢走到 AC/DC Lane，20 分钟就能逛完精华段，终点刚好去吃晚饭。"
          },
          {
            "id": "au-d7-coda",
            "time": "晚饭",
            "kind": "food",
            "name": "Coda 晚餐",
            "address": "141 Flinders Lane, Melbourne VIC 3000",
            "lat": -37.8162,
            "lng": 144.9704,
            "reservation": "recommended",
            "reservationNote": "墨尔本口碑很稳的巷弄餐厅，晚餐建议提前官网订位。",
            "bookingUrl": "https://www.opentable.com/r/coda-melbourne",
            "cost": {
              "amount": 100,
              "note": "点几道招牌小菜配杯葡萄酒，人均约 A$90–110。"
            },
            "why": "藏在弗林德斯巷半地下室的现代亚澳融合菜，烤鸭春卷和黄咖喱都很出彩。",
            "note": "就在 AC/DC Lane 路口旁，订 19:00 左右最从容。"
          }
        ]
      },
      {
        "id": "au-d8",
        "date": "2027-05-04",
        "city": "墨尔本",
        "title": "卡尔顿花园、Fitzroy 复古街区与老修道院",
        "items": [
          {
            "id": "au-d8-reb",
            "time": "10:30",
            "kind": "sight",
            "name": "皇家展览馆与卡尔顿花园",
            "address": "9 Nicholson Street, Carlton VIC",
            "lat": -37.8047,
            "lng": 144.9717,
            "reservation": "none",
            "reservationNote": "花园与展览馆外广场免费开放。",
            "bookingUrl": "",
            "cost": {
              "amount": 17.4,
              "note": "myki 交通卡工本费 A$6 + 全天交通封顶 A$11.40。",
              "cat": "transport"
            },
            "why": "5 月初秋梧桐叶变黄，阳光穿过林荫道照在百年白色穹顶建筑上特别出片。",
            "photo": photo("au-d8-reb"),
            "note": "在 Bourke Street 坐 86 或 96 路电车到 Melbourne Museum 站下车即到，绕着喷泉和花园走一圈，东门出去就接上 Fitzroy 街区。"
          },
          {
            "id": "au-d8-fitzroy",
            "time": "11:30",
            "kind": "sight",
            "name": "Fitzroy 街区漫步（Gertrude St 与后街）",
            "address": "Gertrude Street, Fitzroy VIC",
            "lat": -37.806,
            "lng": 144.981,
            "reservation": "none",
            "reservationNote": "街区随逛随停，午饭直接在街边挑喜欢的馆子。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "逛街免费，午饭已含在每日餐费预算里。"
            },
            "why": "墨尔本最有生活气息的老街区，维多利亚式铸铁阳台排屋里藏着独立书店、买手店和烘焙坊。",
            "photo": photo("au-d8-fitzroy"),
            "note": "沿着 Gertrude Street 往东逛，随时拐进北侧安静的 Rose Street、Kerr Street 看老排屋和画廊；中午在附近喝杯 Flat White、吃顿 Brunch（如 Lune 可颂或 Archie's All Day）。"
          },
          {
            "id": "au-d8-convent",
            "time": "14:00–16:15",
            "kind": "sight",
            "name": "Abbotsford Convent 老修道院艺术园",
            "address": "1 St Heliers Street, Abbotsford VIC",
            "lat": -37.8025,
            "lng": 145.0036,
            "reservation": "none",
            "reservationNote": "园区全天免费。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费，往返公交与火车已含在当天 myki 封顶里。"
            },
            "why": "亚拉河湾畔的百年修道院建筑群，大草坪、花园面包房与手工作坊安静得像世外桃源。",
            "photo": photo("au-d8-convent"),
            "note": "从 Fitzroy 走到 Johnston Street 坐 200 或 207 路公交到终点 Clarke Street 下车（打车也只要 10 分钟），顺着河岸步道还可以走到隔壁小农场看看。"
          },
          {
            "id": "au-d8-back-city",
            "time": "16:30–17:00",
            "kind": "transport",
            "name": "Victoria Park 站乘火车回市中心",
            "address": "Victoria Park Station, Abbotsford",
            "lat": -37.7995,
            "lng": 144.9945,
            "reservation": "none",
            "reservationNote": "刷 myki 进站。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "已含在当天 myki 封顶里。"
            },
            "note": "从修道院步行 12 分钟到车站，坐 Mernda 或 Hurstbridge 线约 10 分钟回到 Flinders Street。"
          },
          {
            "id": "au-d8-southbank",
            "time": "17:45–20:00",
            "kind": "food",
            "name": "雅拉河南岸（Southbank）日落散步与晚餐",
            "address": "Southbank Promenade, Melbourne",
            "lat": -37.8204,
            "lng": 144.9647,
            "reservation": "none",
            "reservationNote": "河畔餐厅与唐人街/意大利街馆子选择极多，现场挑即可。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "餐费已计入每日三餐预算。"
            },
            "why": "沿着王子桥与雅拉河岸看市中心高楼亮起灯火，找家河景餐厅或去 Lygon St 吃意面收尾。",
            "note": "如果在澳洲的最后一晚想吃热乎中餐，从河边走两个街区就是 Little Bourke St 唐人街；若明天搭早班机回国，今晚吃完记得提前把箱子打包好。"
          },
          {
            "id": "au-d8-ngv",
            "time": "下雨再去",
            "kind": "sight",
            "name": "维多利亚国家美术馆（NGV International）",
            "address": "180 St Kilda Road, Melbourne",
            "lat": -37.8226,
            "lng": 144.9689,
            "reservation": "none",
            "reservationNote": "常设馆藏免费直接入场，仅大型特展需购票。",
            "bookingUrl": "https://www.ngv.vic.gov.au/whats-on/",
            "cost": {
              "amount": 0,
              "note": "常设展免费。"
            },
            "why": "澳洲馆藏最丰富的美术馆，入口水幕墙与彩绘玻璃穹顶大厅本身就值得一看。",
            "photo": photo("au-d8-ngv"),
            "note": "如果这天碰上刮风下雨，就把户外老修道院换成这里。从弗林德斯街车站过桥往南走 8 分钟就到。"
          }
        ]
      },
      {
        "id": "au-d9",
        "date": "2027-05-05",
        "city": "墨尔本",
        "title": "皇家植物园晨间散步，返程回国",
        "items": [
          {
            "id": "au-d9-garden",
            "time": "北京出发才去",
            "kind": "sight",
            "name": "皇家植物园与战争纪念馆露台",
            "address": "Shrine of Remembrance, Birdwood Avenue, Melbourne",
            "lat": -37.8305,
            "lng": 144.9734,
            "reservation": "none",
            "reservationNote": "两处均免费开放（植物园 07:30 开园，纪念馆 10:00 开放）。",
            "bookingUrl": "",
            "cost": {
              "amount": 0,
              "note": "免费。"
            },
            "why": "登上纪念馆顶层露台正对市中心中轴天际线，隔壁就是黑天鹅游弋的皇家植物园湖畔。",
            "note": "适合搭傍晚航班（如北京线 19:40 起飞）的半日慢逛：从酒店沿圣基尔达路散步过去，中午在园内湖边咖啡馆吃简餐，15:00 前回酒店取行李即可。"
          },
          {
            "id": "au-d8-air",
            "time": "回程",
            "kind": "transport",
            "name": "南十字星站乘 SkyBus 前往墨尔本机场",
            "address": "Southern Cross Station",
            "lat": -37.8184,
            "lng": 144.9525,
            "reservation": "none",
            "reservationNote": "直接刷去程买好的往返二维码上车。",
            "bookingUrl": "https://www.skybus.com.au/",
            "cost": {
              "amount": 0,
              "note": "已含在往返套票里。"
            },
            "note": "SkyBus 24 小时发车，车程约 35–45 分钟。国际航班建议至少提前 3 小时到机场办理退税和托运（北京 19:40 航班约 15:45 前上车；上海 08:00 早班机需凌晨 04:30 前上车）。"
          }
        ]
      }
    ]
  }
];
