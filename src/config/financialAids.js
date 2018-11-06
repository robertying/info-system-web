/**
 * 需要感谢信和专用申请表的助学金配置
 */

const formRequired = ["张明为"];

const thanksSalutations = {
  黄乾亨助学金: "尊敬的黄乾亨基金会有关人士",
  李捷参助学金: "李捷参先生親屬",
  怀庄助学金: "庄人川先生、陈友忠先生等爱心人士",
  励志助学金: "尊敬的陈伯佐先生",
  兴大助学金: "尊敬的北京兴大基金会有关人士",
  新长城自强助学金: "ABB中国有限公司",
  清荷奖助学金: "尊敬的羽心学长",
  中海油助学金: "中国海洋石油总公司",
  恒大集团助学基金: "恒大集团",
  健博助学金: "尊敬的捐助人",
  黄俞助学金: "尊敬的黄俞先生",
  喜来健助学金: "喜来健集团",
  宋慧清助学金: "尊敬的宋慧清女士，安英慧女士",
  刘承荫助学金: "尊敬的刘庄教授",
  龙门希望工程助学金: "尊敬的伦景光教授、伦景雄先生、伦景良先生",
  清华伟新励学金: "尊敬的香港伟新教育基金会爱心人士",
  西南联大关衍辉助学金: "尊敬的关衍辉先生后辈",
  周氏助学金: "尊敬的周全浩、周全洋二位先生",
  张荣发助学金: "尊敬的张荣发基金会的有关人士",
  唐仲英德育: "尊敬的唐仲英基金会的有关人士",
  香港思源奖助学金: "香港思源基金会",
  唐森隆助学金: "尊敬的唐志宏先生",
  西南联大曾荣森教育基金: "尊敬的曾荣森学长",
  民荣助学: "尊敬的高益民先生、崔桂荣女士",
  叶杰全助学金: "尊敬的叶杰全博士",
  昱鸿助学金: "尊敬的吴官正学长",
  张明为助学金: "尊敬的张明为先生",
  刘淑清助学金: "尊敬的刘自鸣女士",
  朱瑞贞助学金: "尊敬的惠邵宗先生及家属",
  清泉助学金: "尊敬的韩翌昕女士",
  潍柴动力助学金: "潍柴动力",
  周文珊助学金: "尊敬的周文珊学长遗嘱执行人",
  谢澄甫励学基金: "尊敬的谢澄甫学长",
  郭杰励学基金: "尊敬的郭杰学长",
  "81级校友励学基金": "尊敬的1981级的学长们",
  利源励学金: "尊敬的严陆根学长",
  河南校友会励学金: "尊敬的河南校友会的学长们",
  雨桐励学基金: "尊敬的陈旭学长",
  葛俊卿遇平静励学基金: "尊敬的葛俊卿、遇平静学长",
  杰睿励学基金: "尊敬的老师",
  传信励学基金: "尊敬的学长们",
  "生7班（1987级）励学金": "尊敬的1987级生7班的学长们",
  廖锡麟姜恩涓励学基金: "尊敬的廖锡麟、姜恩涓学长",
  德强励学金: "尊敬的李小龙学长",
  樊富珉王佳励学金: "尊敬的樊富珉、王佳学长",
  李伟励学基金: "尊敬的郑建新女士",
  江西校友会励学金: "尊敬的江西校友会的学长们",
  魏慎之黄达河励学基金: "尊敬的学长",
  深圳狮子会励学基金: "尊敬的深圳狮子会的狮友们",
  环82级二十一世纪励学金: "尊敬的1982级环21、环22班的学长们",
  "1982级励学基金": "尊敬的1982级的学长们",
  明德励学基金: "北京世纪明德教育科技有限公司",
  观音山励学基金: "尊敬的黄淦波学长",
  航院力海天空励学金: "尊敬的航院的老师、学长们",
  孟昭英励学基金: "尊敬的赵伟国学长",
  常迵励学基金: "尊敬的赵伟国学长",
  黄绍良励学基金: "尊敬的王琬学长",
  佛山翁开尔励学基金: "尊敬的徐飞学长",
  建五班励学基金: "尊敬的1965届建五班的学长们",
  林宗棠励学基金: "尊敬的林宗棠学长",
  林芳励学基金: "尊敬的林芳学长",
  香港清华同学会励学基金: "尊敬的香港清华同学会的学长们",
  张维国励学基金: "尊敬的张维国学长",
  "22F6励学金": "尊敬的原22号楼6层的学长们",
  李诗颖励学基金: "尊敬的学长",
  马晓云励学基金: "尊敬的凌复云、马晓云学长",
  赵驹励学基金: "尊敬的赵驹学长",
  林徽因励学基金: "尊敬的梁伯彤、杨文娟学长",
  "1983级励学基金": "尊敬的1983级的学长们",
  常州校友会励学金: "尊敬的常州校友会的学长们",
  徐大宏项蕊芳励学基金: "尊敬的徐大宏、项蕊芳学长",
  吴波互联网励学基金: "尊敬的吴波学长",
  叶青励学基金: "尊敬的叶青学长",
  崔建平励学基金: "尊敬的崔建平学长",
  沿海地产励学基金: "沿海地产投资（中国）有限公司的学长们",
  李怀新励学基金: "尊敬的李怀新学长",
  谢超励学基金: "尊敬的谢超学长",
  "1988级励学基金": "尊敬的1988级的学长们",
  "1978级励学基金": "尊敬的1978级的学长们",
  吕大龙269励学基金: "尊敬的吕大龙学长",
  宗家源励学基金: "尊敬的宗家源学长",
  陶葆楷励学基金: "尊敬的赵伟国学长",
  力62励学金: "尊敬的工程力学系96级力62班的学长们",
  "清华EMBA06-DEF班励学基金": "尊敬的清华EMBA06-DEF班的学长们",
  佛山校友会励学基金: "尊敬的佛山校友会的学长们",
  英语八八励学基金: "尊敬的1988级英八班的学长们",
  华硕励学基金: "华硕集团公司",
  计算机系思源励学基金: "尊敬的清华大学计算机系的学长们",
  谦君励学基金: "尊敬的韦龙城学长",
  龚育之励学基金: "尊敬的赵伟国学长、工明学长",
  羽珊励学基金: "尊敬的刘凡、彭俊青学长",
  "孟少农励学基金（陕汽）": "陕西汽车集团有限责任公司",
  "孟少农－东风汽车励学基金": "东风汽车公司",
  恒新励学金: "尊敬的黄新刚、刘恒学长",
  机械系友励学基金: "尊敬的机械系的学长们",
  "五粮液科技&久久励学基金": "五粮液集团和北京久徳励志科技有限公司",
  常州校友会学真励学金: "尊敬的蒋学真先生",
  "励久（79）励学基金": "尊敬的1979级工程力学系的学长们",
  "1989级励学基金": "尊敬的1989级的学长们",
  "钱锡康、夏冰励学金": "尊敬的钱锡康、夏冰学长",
  清华九三励学基金: "尊敬的九三学社清华大学委员会",
  深圳市宝安区安监系统励学基金: "尊敬的深圳市宝安区安监系统的学长们",
  惠州校友会励学基金: "尊敬的惠州校友会的学长们",
  "1949级励学基金": "尊敬的1949级的学长们",
  解放战争时期清华老校友励学基金: "尊敬的解放战争时期的清华学长们",
  李道增励学基金: "尊敬的学长们",
  汪家鼎励学基金: "尊敬的学长们",
  滕藤奖学励学基金: "尊敬的学长们",
  机械85励学金: "尊敬的1985级机械系的学长们",
  李衍达励学基金: "尊敬的学长",
  机械系学长励学基金: "尊敬的黄庆森学长",
  立升励学金: "尊敬的陈良刚学长",
  刘少梅励学基金: "尊敬的刘少梅学长",
  "清华校友励学金（王光明）": "尊敬的王光明学长",
  "1976级励学基金": "尊敬的1976级的学长们",
  郑维敏暨工企校友励学基金: "尊敬的原工企专业学长们",
  傅恭兴励学基金: "尊敬的付蓁、付晔、付蕙学长",
  清华大学1985级90届校友励学基金: "尊敬的1985级90届学长们",
  史志立励学金: "尊敬的史志立学长",
  清华江西校友励学基金: "泰豪集团有限公司",
  "郑维敏－奖学励学基金": "尊敬的学长们",
  清华校友零零励学基金: "尊敬的零零字班学长们",
  高景德励学基金: "尊敬的王武学长",
  谢希仁励学基金: "尊敬的谢希仁学长",
  "1973级励学金": "尊敬的1973级的学长们",
  张仁励学金: "尊敬的张仁学长",
  游卫东励学基金: "福建卫东环保科技有限公司",
  爱心勤工励学金: "尊敬的学长们",
  少艾励学基金: "尊敬的戴少艾学长",
  朱蕾励学基金: "尊敬的1991级化13班学长们",
  逸轩励学基金: "尊敬的陈斌学长",
  倪维斗院士奖学励学基金: "尊敬的学长们",
  高联佩励学基金: "尊敬的高一虹女士、高义舟先生",
  纪远东励学金: "尊敬的纪远东学长",
  泰豪科技励学金: "尊敬的黄代放学长",
  清华校友励学基金: "尊敬的学长",
  无锡校友会励学金: "尊敬的无锡校友会的学长们",
  清华建五校友黄均德励学基金: "尊敬的黄均德学长",
  华融泰资产管理有限公司励学金: "华融泰资产管理有限公司",
  过增元院士奖学励学基金: "尊敬的学长们",
  "水工83（二）班励学基金": "尊敬的水工83（二）班的学长们",
  慧众励学基金: "尊敬的赵六奇、张小璠、赵征学长",
  杰辉励学金: "尊敬的徐沾杰学长",
  拱旭升励学金: "尊敬的拱旭升学长",
  "自43(94级)金枫叶励学基金": "尊敬的1994级自43班的学长们",
  "清华校友励学金（王德盛）": "尊敬的王德盛学长",
  云芸励学金: "尊敬的刘振飞、周奇学长",
  "广州校友会励学金（朱荣斌）": "尊敬的朱荣斌学长",
  "广州校友会励学金（蔡程举）": "尊敬的蔡程举学长",
  "广州校友会励学金（严道平）": "尊敬的严道平学长",
  "广州校友会励学金（陈翀）": "尊敬的陈翀学长",
  "广州校友会励学金（田铁勇）": "尊敬的田铁勇学长",
  "广州校友会励学金（贺臻）": "尊敬的贺臻学长",
  "广州校友会励学金（阎华英）": "尊敬的阎华英学长",
  "广州校友会励学金（王辛淮）": "尊敬的王辛淮学长",
  "广州校友会励学金（郑丁）": "尊敬的郑丁学长",
  "广州校友会励学金（卜德华）": "尊敬的卜德华学长",
  "广州校友会励学金（余广健、赵仲明）": "尊敬的余广健、赵仲明学长",
  "广州校友会励学金（苏清）": "尊敬的苏清学长",
  "广州校友会励学金（黄河）": "尊敬的黄河学长",
  "广州校友会励学金（伏拥军）": "尊敬的伏拥军学长",
  "广州校友会励学金（路成桥）": "尊敬的路成桥学长",
  "广州校友会励学金（李向龙）": "尊敬的李向龙学长",
  "广州校友会励学金（许旭升）": "尊敬的许旭升学长",
  "广州校友会励学金（徐春龙）": "尊敬的徐春龙学长",
  "广州校友会励学金（黄斌）": "尊敬的黄斌学长",
  "广州校友会励学金（何伟）": "尊敬的何伟学长",
  "广州校友会励学金（张纳新）": "尊敬的张纳新学长",
  "广州校友会励学金（章正荣）": "尊敬的章正荣学长",
  "广州校友会励学金（贡华）": "尊敬的贡华学长",
  "广州校友会励学金（彭深）": "尊敬的彭深学长",
  "广州校友会励学金（杨柳、游江峰、黄新民）": "尊敬的杨柳、游江峰、黄新民学长",
  "广州校友会励学金（李晓强）": "尊敬的李晓强学长",
  "广州校友会励学金（李东泽）": "尊敬的李东泽学长",
  "广州校友会励学金（黄笑华）": "尊敬的黄笑华学长",
  "广州校友会励学金（何敏丽）": "尊敬的何敏丽学长",
  "广州校友会励学金（宋晓平）": "尊敬的宋晓平学长",
  "广州校友会励学金（寇汉）": "尊敬的寇汉学长",
  "广州校友会励学金（谢海峰）": "尊敬的谢海峰学长",
  EMBA10E班励学基金: "尊敬的EMBA10E班学长们",
  "1998级励学基金": "尊敬的1998级的学长们",
  马洪琪院士励学基金: "尊敬的马洪琪院士",
  王补宣院士奖学励学基金: "尊敬的学长们",
  柳百成院士励学基金: "尊敬的学长们",
  清华深圳研究院励学金: "尊敬的刘鲲学长",
  代贻榘励学基金: "尊敬的王秉钦学长",
  物理系91级励学基金: "尊敬的物理系1991级学长们",
  山西校友会励学基金: "尊敬的山西校友会的学长们",
  傅任敢励学基金: "尊敬的学长们",
  东莞校友会励学金: "尊敬的东莞市清华大学校友会的学长们",
  庄礼深励学基金: "尊敬的庄礼深学长",
  方周励学金: "尊敬的方若凡、周奇学长",
  "王伊初、王羽绯励学金": "尊敬的王洪浩学长",
  谷兆祺励学基金: "尊敬的学长",
  李明励学金: "尊敬的李明学长",
  李志坚励学基金: "尊敬的学长们",
  "1974级励学基金": "尊敬的1974级的学长们",
  柳百成院士励学金: "尊敬的汪涛学长",
  黄圣伦励学基金: "尊敬的黄圣伦学长",
  珠海市得理慈善基金会清华励学金: "珠海市得理慈善基金会",
  北京钧天工贸有限公司励学金: "尊敬的邓源学长",
  清华农业银行校友励学金: "尊敬的清华农行校友们",
  清华78届雷四班校友及苏宁电器励学基金:
    "尊敬的1978届雷4班的学长们及苏宁电器股份有限公司领导",
  波士顿校友励学金: "尊敬的波士顿清华校友会的学长们",
  物理1991级中兴励学基金: "尊敬的物理系1991级学长们",
  昊轩励学基金: "尊敬的隋晓峰、姜微微学长",
  "杨友龙、何肇琛伉俪励学基金": "尊敬的杨友龙、何肇琛学长",
  黄永东励学基金: "尊敬的黄永东学长",
  董文华程娴励学基金: "尊敬的程娴学长、董旻先生",
  "清华校友励学金（任向军）": "尊敬的任向军学长",
  张思敬励学基金: "尊敬的张思敬学长"
};

export default { formRequired, thanksSalutations };
