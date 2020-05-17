import rand from './random';
import { Increment, range, uuid, formatDate } from './util';

const COMMON = '云舟巨鹏飞捷华禄富瑞天隆益力发文化世新金润寿宏康丰本恒明大先弘春利如伟贵长达德光安翔童青兴美环易锐博涛同辉洪晨聚佳仙渊勤百全汇凯慧超庆仁东星夏阳城千广福万畅宝旺进合和雅浩成满祥奇永平升丽鼎立通意迪健柏友峰铭胜坤',
  SURE_CN = '李王张刘陈杨赵黄周吴徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧程曹袁邓许傅沈曾彭吕苏卢蒋蔡贾丁魏薛叶阎余潘杜戴夏钟汪田任姜',
  FEM_CN = '芳娜敏静丽艳娟霞秀燕玲桂丹萍红玉兰英梅莉珍雪帅慧宁婷凤晶欢颖佳倩琴云洁柳淑晨荣莹云婷琳欣博香芝楠霞瑜璐',
  MALE_CN = '伟强磊洋勇军杰涛超明刚平辉鹏华飞鑫波斌宇浩凯健俊帆帅旭龙林阳亮成建峰国军晨瑞志兵雷东博彬坤想岩杨文利轩',
  SURE_EN = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez','Robinson' ],
  MALE_EN = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Charles', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Paul', 'Mark', 'Donald', 'George', 'Kenneth', 'Steven', 'Edward', 'Brian'],
  FEM_EN = ['Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Maria', 'Susan', 'Margaret', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon'],
  COUNTRY_EN = ['United States', 'China', 'Japan', 'Germany', 'United Kingdom', 'France', 'India', 'Italy', 'Brazil', 'Canada', 'South Korea', 'Russia', 'Australia', 'Spain', 'Mexico', 'Indonesia', 'Turkey', 'Netherlands', 'Switzerland'],
  COUNTRY_CN = ['美国', '中国', '日本', '德国', '英国', '法国', '印度', '意大利', '巴西', '加拿大', '韩国', '俄罗斯', '澳大利亚', '西班牙', '墨西哥', '印度尼西亚', '土耳其',  '荷兰', '瑞士'],
  COMPANY = ['股份', '科技', '电子', '实业', '商贸', '机械', '服装', '广告', '建材', '物流', '能源', '办公用品', '信贷', '培训', '酒店', '房地产', '食品', '汽车服务', '五金'],
  BUILD = ['新村','花园', '小区', '苑', '大厦', '公寓', '楼', '广场', '城'],
  ROAD = ['建设', '人民', '文化', '迎宾', '朝阳', '育才', '振兴', '光明', '幸福', '解放', '团结', '公园', '和平', '新华', '西环', '胜利', '南环', '平安', '向阳', '滨河', '东环', '友谊', '富民', '前进'],
  AVENUE = ['路','街','大道'],
  DOMAIN = ['com','cn','com.cn','net'],
  DI_CODE = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65],
  DI_NAME = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省','上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'],
  DI_SHORT = '京津冀晋蒙黑吉辽沪苏浙皖闽赣鲁湘鄂豫粤桂琼川云贵藏陕甘青宁新';

export { rand };

export const util = {
  incre: (a?: number, b?: number) => new Increment(a, b),
  range,
  uuid
}

export const text = {
  repeat: (n = 1, arg = '填充文本样式') => 
    arg.repeat ? arg.repeat(n) : new Array((n || 10) + 1).join(arg),
  chinese: (num?: number) => {
    const len = num ? num : rand.int(5, 10),
      s = new Array(len);

    for (let i = 0; i < len; i++)
      s[i] = String.fromCharCode(rand.int(19968, 40869));
    return s.join('');
  }
    
}

export const date = {
  time(bt?: string | number | Date, et?: string | number| Date, fmt?: string) {
    const b = bt ? new Date(bt).getTime(): -28800000,
      e = et? new Date(et).getTime(): new Date().getTime(),
      date = new Date(rand.int(b, e));

    return fmt ? formatDate(date, fmt) : date;
  },
  now: (fmt?: string) => fmt ? formatDate(new Date(), fmt) : new Date(),
  year : () => rand.int(1949, 2020),
  month: () => rand.int(1, 12),
  day: () => rand.int(1, 28),
  hour: () => rand.int(1, 24),
  minute: () => rand.int(0, 59),
}

export const cn = {
  firstName: () => rand.str(1, SURE_CN),
  maleName:  () => rand.str(1, SURE_CN) +  rand.str(rand.int(1,2), MALE_CN),
  femaleName:  () => rand.str(1, SURE_CN) +  rand.str(rand.int(1,2), FEM_CN),
  fullName:  () => rand.str(1, SURE_CN) +  
    (rand.bool() ?  rand.str(rand.int(1,2), MALE_CN) : rand.str(rand.int(1,2), FEM_CN)),
  mobile: () => rand.pick(['13'+ String(rand.int(1, 9)),'15'+ rand.numstr(1),'17'+ rand.str(1, '018')]) + rand.numstr(8), 
  idcard: () => {
    const pad = (num: number) => num < 10 ? '0' + String(num) : String(num),
      sn = [rand.pick(DI_CODE), 0, rand.int(1, 5), 0, rand.int(1, 5), date.year(), 
        pad(rand.int(1, 12)), pad(rand.int(1, 28)), rand.numstr(3)].join(''),
      arr = sn.split(''),
      factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0, ai = 0,  wi = 0;

    for (let i = 0; i < 17; i++) {
      ai = +arr[i];
      wi = factor[i];
      sum += ai * wi;
    }
    return sn + String(parity[sum % 11]);
  },
  autocard: () =>  rand.str(1, DI_SHORT) + rand.str(1, 'ABCD') + 
    (rand.shuffle(rand.str(1, 'ABCDEFGHJKLMNPQRSTUWYZ') + rand.numstr(4)) as string),
  company: () => rand.str(rand.int(2, 3), COMMON) + rand.pick(COMPANY) + '有限公司',
  country: () => rand.pick(COUNTRY_CN),
  road: () => [rand.pick(ROAD), rand.pick(AVENUE),
    rand.pick(['1','2','3']), rand.numstr(rand.int(1, 3)), '号'].join(''),
  build: () => rand.str(2, COMMON) + rand.pick(BUILD),
  phone: () => rand.str(1, '826') + rand.numstr(rand.int(6, 7)),
  zipcode: () => rand.bool() ? ('0'+ (rand.int(1, 7).toString())): (rand.int(1, 9).toString() +
    rand.int(0, 7).toString()) + rand.numstr(4),
  province: () => rand.pick(DI_NAME)
}

export const en = {
  firstName: () => rand.pick(SURE_EN),
  maleName:  () => rand.pick(MALE_EN) + ' ' + rand.pick(SURE_EN),
  femaleName:  () => rand.pick(FEM_EN) + ' ' + rand.pick(SURE_EN),
  fullName:  () => (rand.bool() ?  rand.pick(MALE_EN) : rand.pick(FEM_EN)) + ' ' + rand.pick(SURE_EN),  
  country: () => rand.pick(COUNTRY_EN),
}

export const web = {
  account: () => rand.letter(1, true) + rand.plus(rand.int(5, 6),'-') + rand.letter(1),
  password: () => rand.letter(1, true) + rand.plus(rand.int(5, 7), '`~!@#$%^&*'),
  qq: () => String(rand.int(1,2)) + rand.numstr(10),
  domain: () => rand.bool() ? rand.alphanum(rand.int(3, 8)) + '.' : '' + 
    rand.alphanum(rand.int(3, 8)) + '.' + rand.pick(DOMAIN),
  url: () => ['http'+ rand.once('s') + '://www',
    rand.alphanum(rand.int(3, 8)), rand.pick(DOMAIN) + 
    rand.once('/' + rand.letter(rand.int(3, 8)))].join('.'), 
  email: () => [rand.letter(rand.int(3, 8)) + '@' +
    rand.alphanum(rand.int(3, 8)), rand.pick(DOMAIN)].join('.'),
  ip: (local = false) => [local ? rand.pick(['198','172','10']) : rand.int(0, 255),
    rand.int(0, 255), rand.int(0, 255), rand.int(0, 255)].join('.'),
  color: () => '#'+ rand.hex(6),
}
