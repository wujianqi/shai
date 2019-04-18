<div align=center>

![shai.js](https://github.com/wujianqi/shai/raw/master/svg/logo.svg?sanitize=true) <br>

数据生成模拟、验证工具库

</div>

------

“晒.JS” 简介： 

- [x] 前后台通用，浏览器IE9+ （即支持ES5） <br>
- [x] 针对国人国情定制、使用简单、易扩展 <br>
- [x] 模拟生成（maker）：内置方法60项，让数据看起来更真实，规则简单 <br>
- [x] 验证（validator）：内置方法85项，链式，结构即类型<br>
- [x] 区划更新到 2019.2 [民政部公示](http://www.mca.gov.cn/article/sj/xzqh/2019/)  <br>

------

安装：

```npm
npm i shai
```

------

## 数据生成与模拟 ![maker.js](https://github.com/wujianqi/shai/raw/master/svg/maker.svg?sanitize=true) 

```javascript
import shai from 'shai';

var m = new shai.Maker();

// 如果需要设定全局选项，则可如下：
var m = new shai.Maker({
    divisionCode: '610000',
    beginTime: new Date('1980/06/01'),
    endTime: new Date('2018/06/01')
});

```
配置选项(config)：

> ***divisionCode***  设定全局的行政区划范围（行政区划代码），默认全国（不含港澳台） <br>

> ***beginTime***  全局时间范围的开始时间，默认1970-01-01<br>

> ***endTime***  全局时间范围的结束时间，默认当前时间 <br>

**m.get(key:string, ...args:array)** 生成数据，包括md5、uuid, 及模拟数据等。

###### get 参数说明：

> 参数1 ***key*** 为方法名； <br>

> 参数2 ***args*** 为可选，方法中的更多参数。

**m.add(key:string, fn:function)** 添加新的生成数据的方法，配合get('custom', 'key') 使用。

###### add 参数说明：

> 参数1 ***key*** 为方法名； <br>

> 参数2 ***fn*** 为可选，方法函数。


**m.make(content:string|object, parseValueType:boolean|string, optionKey:string)** 根据JSON模板，生成设值后的新JSON

###### make 参数说明：

> 参数1 ***content*** 为JSON模版；string或object，如果本参数是字符串则函数输出为字符串，如果是对象则输出也是对象 <br>

> 参数2 ***parseValueType*** 是否需要转换值的类型，默认为true，即是，转换。注：模板静态数据内容不受此限制。<br>
>> 如"key": <% int %>, 如果参数1为对象，标准JSON不支持直接放特殊字符，因此需改为"key": "<% int %>"，因此类型需要转换；<br>
>> parseValueType 设为false，为保留文本，设为string，则为指定的需转换的方法名，不同的方法名使用,号隔开<br>

> 参数3 ***optionKey*** 自定义循环输出的对象属性名，默认为makerOption。 string，详细JSON模板说明<br>

**m.increment = 0**   重置自增长基数

###### JSON模版 约束规则说明：

> 方法名、参数，使用这种方式：<% int, 0, 2 %>  <br>

> 多列批量或嵌套的数据输出配置，在目标对象里加属性：makerOption（也可自定义，见make）, 说明如下：<br>

>> 值为“参数”数组，例："makerOption": [2,3,'childrens']
>> 数组元素1，默认情况下为输出对象的个数，即数组长度，但有数组元素3的情况下，为嵌套的层数；必需项！<br>
>> 数组元素2，默认不设值，当设值后，无数组元素3的情况下，数组元素1变为随机数字的下限值，数组元素2为上限值；有数组元素3的情况下，为嵌套对象的个数，及嵌套对象数组长度；<br>
>> 数组元素3，默认不设值，当设值后，为嵌套对象的属性名，文本<br>

> 模版示例：<br>

```json
{
  "realname": "<% cnName %>",
  "address": "<% address %>",
  "log": {
    "makerOption": [2],
    "id_<% increment %>": "<% int, 0, 200 %>",
    "condition": "<% enum,开始,启用,停止 %>",
    "log": {
        "makerOption": [2, 3, "items"],
        "time": "<% datetime %>",
        "msg": {
          "code": "<% int %>"
        }
    }
  }
}

```

##### 用法例子：

```javascript
  import shai from 'shai';
  // ES5使用 const shai = require('shai');

  // 引用独立模块（不含数据验证）
  // ES5方式 const Maker = require('shai/lib/maker');
  // ES6方式 import Maker from 'shai/lib/maker.esm'; 
  // var m = new Maker(); 

  var m = new shai.Maker();

  m.get('cnName') // 返回 张伟
  m.get('bodycard') // 返回 120101199901011693  
  m.get('enum','是','否') // 返回 是
  m.get('province') //返回 北京市

  // 扩展
  m.add('test1', foo => 123 + foo);  // 方式一
  m.get('custom', 'test1', '234'); 
  m.get('custom', foo => 123 + foo, '234'); // 方式二，但模板中无法使用

  // 使用文本模板生成JSON数据
  var user = m.make(`{
    "realname": "<% cnName %>",
    "address": "<% address %>",
    "log": {
      "makerOption": [1, 3],
      "id_<% increment %>": "<% int, 0, 200 %>",
      "date": <% date %>,
      "condition": "<% enum, 开始, 启用, 停止 %>"
    }
  }`);

    console.log(user);

// 使用对象模板生成模拟JSON数据（holder图片引用示例）
  m.add('image', (str1, str2) => {
    return `<img src="holder.js/${str1}x${str2}">`;
  })

  var user = m.make({
    realname: "<% cnName %>",
    address: "<% address %>"
    avatar: "<% custom, image, 80, 80 %>"
  });
  console.log(user);


  // 仅使用单项数据生成，不使用模板
  var user = {
    realname: m.get('cnName'),
    address: m.get('address'),
    log: []
  };
  for (let i = 0; i < 3; i++) {
    user.log.push({
      "id_" +  m.get('increment'): m.get('int', 0, 200)
      date: m.get('date'),
      condition: m.get('enum','开始','启用','停止')
    });
  }
  console.log(user);

```

#### 数据生成方法类型：

| Key Name  | 说明  | 
| --------------------- | --------------------- |
| **基本数据生成**  |   | 
| uuid                  | UUID，以时间为因子。可选1个参数，为指定分隔符号，默认为-符号 |
| md5                   | MD5，可选2个参数，参数1为是否为16位，默认32位，参数2为指定生成密码内容 |
| now                   | 当前时间，可选1个参数，为指定格式，如now('yyyy-MM-dd hh:mm:ss') |
| increment             | 递增整数，可选2个参数，参数1为是否保持增长，false为仅引用上一增长值, 参数2为步长 |
| **简单随机**|   | 
| enum                  | 自定义范围随机取值，参数为枚举，如enum('a','b','c'), 参数N个 |
| bool                  | 布尔，true或false |
| **数字类**|   | 
| int                   | 整数，可选2个参数，参数1为下限值，参数2位上限值 |
| number                | 数字，可选3个参数，参数1为下限值(整数)，参数2位上限值(整数)，参数3为小数位数(整数) |
| alpha                 | 数字，0.1~0.9 |
| **颜色类**|   | 
| color                 | 颜色，如 #000FFF |
| rgb                   | 颜色，如 rgb(255,0,0)，可选1个参数，是否带alpha值，默认false |
| hsl                   | 颜色，如 hsl(27, 88.99%, 81.83%) 可选1个参数，是否带alpha值，默认false |
| **时间类** |   | 
| date                  | 日期，如 2017-11-11 （全局时间段内） |
| time                  | 时间，如 11:11:08（全局时间段内） |
| datetime              | 时间，可选1个参数，为指定格式，如datetime('yyyy-MM-dd hh:mm:ss')，（全局时间段内） |
| year                  | 年 （全局时间段内） |
| month                 | 月 |
| day                   | 日 |
| hour                  | 时 |
| minute                | 分 |
| **区域类** |   | 
| enState               | 英文国名 |
| cnState               | 中文国名 |
| zipcode               | 邮编（依据全局区划） |
| citycode              | 行政代码（依据全局区划） |
| province              | 省（依据全局区划） |
| prefecture            | 市州盟（依据全局区划），division为省级，可循环所属市名称 |
| county                | 县区（限定地区），division为省或市级，可循环所属县区名称 |
| lon                   | 地理位置，经度，（依据全局区划） |
| lat                   | 地理位置，纬度，（依据全局区划） |
| autocard              | 车牌号码（依据全局区划） |
| address               | 住址，当前县/区+路+号+...等 （依据全局区划） |
| phone                 | 固定电话（依据全局区划，自动识别8位或7位） |
| **商业类** |   |
| company               | 企业名称（依据全局区划） |
| bizcode               | 统一信用编码 |
| bankcard              | 银行卡号 |
| price                 | 价格，可选参数1为下限数，可选参数2为上限数，可选参数3为是否带分号, true或false |
| mid                   | 型号，货号、编号 |
| **账号网络类**|   | 
| enName                | 英文姓名 |
| enMaleName            | 英文姓名 男 |
| enFemaleName          | 英文姓名 女 |
| surname               | 中文姓 |
| cnName                | 中文姓名 |
| cnMaleName            | 中文姓名 男 |
| cnFemaleName          | 中文姓名 女 |
| bodycard              | 身份证（依据全局区划、全局时间段） |
| account               | 账号名 |
| password              | 密码 |
| validcode             | 验证随机数，可选1个参数，位数 |
| mobile                | 手机 |
| url                   | 网址 |
| mail                  | 邮箱 |
| ip                    | IP，可选参数1，是否为局域网IP |
| port                  | 端口 |
| **文本块类** |   | 
| english               | 英文，可选2个参数，参数1为长度，参数2为备选随机英文字串 |
| upper                 | 大写字母，可选参数1，指定转换的文本 |
| lower                 | 小写字母，可选参数1，指定转换的文本 |
| chinese               | 中文，可选2个参数，参数1为长度，参数2为备选随机中文字串， |
| text                  | 文本填充，可选3个参数，参数1为显示次数或为随机下限值，参数2为指定文本，参数3为随机上限值 |
| **自定义** |   | 
| regexp                | 自定义正则，可选参数为字符串表达式，写在模版中请使用string类型，注意转义 |
| custom                | 自定义方法，参数为string或函数，string为add添加的key名，模板中仅限string使用 |


------

#### 配套功能补充说明（结合其它库）

* Http请求拦截: [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) <br>
* API服务模拟:[json-server](https://github.com/typicode/json-server) <br>
* 图片数据：[holder](https://github.com/imsky/holder) <br>

------

## 数据验证模块 ![validator.js](https://github.com/wujianqi/shai/raw/master/svg/validator.svg?sanitize=true) 

```javascript
import shai from 'shai';

var v = new shai.Valitator();
// ……
```

**v.check(value:any)** 单项数据验证，返回值为链式对象，详见链式对象说明。

**v.get(obj:object, path(string|array))** 指定对象路径验证，返回值为链式对象，见示例。

**v.string | v.number | v.object | v.array | v.boolean | v.null**  直接使用链式验证对象。

###### 链式对象说明：

> **chain.result**，所有链节点都是索引，只有调用result，即验证结果（布尔值），才真正生效。 <br>
> **chain.on(rule:string|function, function)**，验证过程回调函数（可选），见示例。<br>
> chain.eq('foo')，1位参数的规则项：eq、not、gt、gte、lt、lte、length、minlength、maxlength、bitmax、in、has、regexp <br>
> chain.between(10,20)，2位参数的规则项：between <br>
> 可变参数长度，1位以上参数的规则项：min、max、custom <br>
> 除以上规则，均为直接使用属性方式：v.string.english.upper <br>
> 链式验证对象支持所有规则任意搭配，但不建议无意义的组合，例：v.null<del>.length(10)</del> <br>

**v.verify(json:string|object, struct:object, callback:Function)**  JSON数据或对象验证，返回值为是否通过(boolean)

###### verify 参数选项(json, struct, callback)说明：

> 参数1为数据，文本或对象均可，**必须** <br>
> 参数2为数据类型结构，为链式对象组合（不要调result，会改变对象类型），参考代码示例，**必须** <br>
> 参数3为可选回调方法，含2参数，未通过项的组、数据层级路径组，如要保持链内on，可忽略此参数。<br>

**v.add(key:string, fn:Function)** 添加验证数据的方法，见custom规则说明。

**v.isdev = true** 默认false，true为将未通过验证的信息打印输出。

##### 用法例子：

```javascript
  import shai from 'shai';
  var v = new shai.Valitator();

  // 引用独立模块（不含数据模拟）
  // ES5方式 const Valitator = require('shai/lib/valitator');
  // ES6方式 import Valitator from 'shai/lib/valitator.esm'; 
  // var m = new Valitator();

  // 单数据验证
  v.check('password1').eq('password2').result; // 返回false
  v.check('120101199901011693').bodycard.length(18).result; // 返回true

  // 扩展规则方法
  v.add('foo', (val, val2) => val.length === val2.length) // 方式一
  v.check('123').custom('foo', '456'); 
  v.check('123').custom((val, val2) => val.length === val2.length, '456'); // 方式二

  // 绑定回调
  var chain = v.check('yrPqw2{O').password.eq('yr qw2{O').minlength(8)
    .on('password', res => {  // 执行单个规则验证回调
      if(res) console.log('密码验证通过');
      else console.log('密码验证没有通过');
    })
    .on(faults => { // 执行所有验证项后一起回调
      if (faults.indexOf('eq') === -1) console.log('密码二次验证OK！');
      faults.forEach(f => {
        if (f === 'eq') console.log('二次密码错误');
        if (f === 'minlength') console.log('密码长度最少8位');
      });
    });
  console.log(chain.result);

  // 对指定对象值路径判断
  var obj = {notes:[{
      "content": "testdsafsdf"
    }]};
  var chain = v.get(obj, 'notes.0.content').string.maxlength(255);
  console.log(chain.result);

  // 完整JSON数据或对象验证，可任意层级。
  var json = `{
    "name": "张航",
    "address": "深圳市南山区后海大道110号",
    "age":30,      
    "hobby":["tour","sing"],
    "looks":{
      "size": {
        "foot": 41
      },
      "weight":60
    },
    "notes":[
      {
        "content": "testdsafsdf",
        "log": [{
          "local.time": "2012-12-02"
        }]
      },
      {
        "content": "fdafsd22",
        "log": [{
          "local.time": "2016-15-06"
        }]
      }
    ]
  }`;

  var struct = { // 定义类型结构
    name: v.string.chinese.address,
    address: v.string,
    age: v.number.int.eq(30),
    looks: {
      size: {
        foot: v.number.int
      }
    },
    hobby: v.array,
    notes: [
      { content: v.number,
        log: [
          {
            'local.time': v.string.date
          }
        ]
      }
    ]
  };

  var result = v.verify(json, struct);
  console.log(result);

```

#### 数据验证规则类型


| Key Name  | 说明  | 
| -------------------- | -------------------- |
| **基本数据类型**     |  | 
| object               | 是否为对象 |   
| array                | 是否为数组 | 
| number               | 是否为数字 | 
| string               | 是否为文本 | 
| boolean              | 是否为布尔 | 
| null                 | 是否为null值 |
| **字符基本格式**|  | 
| required             | 必需有值！没有required，空值可在链对象中直接通过，设值后才会一一判断。| 
| english              | 纯英文字母 |
| chinese              | 纯中文 |
| alphanum             | 字母和数字组合 |
| upper                | 有大写 |
| lower                | 有小写 |
| nospace              | 不含有空格 |
| safe                 | 不含安全敏感字符 |
| nodbc                | 不含全角特殊字符 |
| **数字格式**|  | 
| float                | 数字 |
| int                  | 整数 |
| decimal              | 小数点1位及以上 |
| currency             | 货币，2小数，带分号|
| percent              | 百分数 |
| even                 | 偶数 |
| odd                  | 奇数 |
| **时间格式** |  | 
| date                 | 日期 2017-7-7或2017/7/7，0补位非必须，含大小月、闰月检测  |
| time                 | 时间 12:12:12，分秒个位须0补位 |
| datetime             | 日期 + 时间 如2017-07-07 12:02:02, 0补位非必须 |
| year                 | 年份 1900-2099 |
| month                | 月份 1-12，不带补位，下同 |
| day                  | 日 1-31 |
| hour                 | 小时 0-23 |
| minute               | 分钟 0-59 |
| **账号与区域** |  | 
| qq                   | QQ号 5-11位 | 
| age                  | 年龄 0-129岁 | 
| zipcode              | 邮编 | 
| account              | 账号名，字母数字组合，中间允许连接线，首位是字母 |
| password             | 密码，最少1大小写字母、1小写字母、1数字、1特殊字符 |
| mobile               | 手机13700000000，融合2017新号规则, +86、86可选 |
| telphone             | 电话手机混合 |
| phone                | 固话，可带分机, +86、86可选 |
| bodycard             | 身份证，含地区、生日、验证数等规则 |
| address              | 住址 |
| citycode             | 6位地区代码
| autocard             | 车牌号码，支持新能源车牌号及港澳等 |
| lon                  | 地理位置——经度，小数点1~15位 |
| lat                  | 地理位置——纬度，小数点1~15位 |
| **网络类** |  | 
| mail                 | 邮箱地址 |
| url                  | 网址 |
| ip                   | IPv4地址 |
| ipv6                 | IPV6地址 |
| port                 | 端口 |
| maca                 | MAC地址 |
| **商业类** |  | 
| bizcode              | 统一信用代码  |
| invoice              | 增值税发票代码 |
| bankcard             | 银行卡号（仅限国内卡）|
| isbn                 | 书号（仅限13位）|
| approval             | 审批文号 政字〔2004〕第18号 或 政字[2004] 18号 |
| **编码格式**|  | 
| ascii                | ASCII码 |
| base64               | BASE64码 |
| md5                  | md5码 |
| uuid                 | UUID码 |
| hex                  | HEX码 |
| color                | 颜色码，16进制 |
| jwt                  | JSON Web Token字符串|
| objectid             | Mongodb ObjectID |
| tag                  | 闭合标签元素|
| **文件扩展名**|  | 
| file                 | 合法文件名 |
| image                | 合法图像文件名 |
| word                 | 合法文档文件名 |
| **比较**  |  | 
| not                  | 不等于 |
| eq                   | 等于 |
| gt                   | 大于 |
| gte                  | 大于或等于 |
| lt                   | 小于 |
| lte                  | 小于或等于 |
| between              | 之间，大于并小于 |
| min                  | 最小 |
| max                  | 最大 |
| minlength            | 字符、数组最小长度 |
| maxlength            | 字符、数组最大长度 |
| length               | 字符、数组长度等于 |
| bitmax               | 字节最大长度，一般汉字为2字节，英文1字节 |
| in                   | 是否为字符、数组元素、对象所包含 |
| has                  | 是否包含字符、数组元素、对象属性，与in相反 |
| empty                | 字符、对象、数组是否为空，数字则判断是否为0 |
| **自定义**  |  | 
| regexp               | 自定义正则判断 |
| custom               | 自定义方法，参数为string或函数，string为add添加的key名，函数最少1个带检测值的参数 |

------

## 浏览器上使用

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="http://www.175.io/lib/shai.js"></script>
    <script>
      v = new shai.Validator(); 	
	  // 如果引用为http://www.175.io/lib/validator.js，则为v = new Validator() ，类推;
	  
      console.log(v.check('1111').required);
	  
    </script>
</head>
<body>
</body>
</html>
```
