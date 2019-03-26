# 数据生成模拟、验证工具库 SHAI library

安装：

```npm
npm i shai
```

简介： 

> 前后台通用，但不支持IE9以下浏览器； <br>
> 针对国人国情定制、使用简单、易扩展，改进了部分通用验证正则； <br>
> 内置数据生成方法50多项，验证方法70多项； <br>
> 区划更新到 2019.2 [民政部公示](http://www.mca.gov.cn/article/sj/xzqh/2019/) <br>

------

## 数据生成与模拟

模拟数据的特色：让数据看起来更真实

- [x] 使用简单，较少的约束规则，模版支持标准JSON配置；<br>
- [x] 以设定的区划，生成关联的电话号码、经纬度坐标、车牌号、身份证等；<br>
- [x] 以行业统计热门、频次高的词汇，生成姓、名、公司名、国名、地址等；<br>


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

**m.get(key:string, ...args:Array)** 生成数据，包括md5、uuid, 及模拟数据等。

###### get 参数说明：

> 参数1 ***key*** 为方法名； <br>

> 参数2 ***args*** 为可选，方法中的更多参数。

**m.add(key:string, fn:Function)** 添加新的生成数据的方法，配合get('custom', 'key') 使用。

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

    var m = new shai.Maker();

    m.get('cnName') // 返回 张伟
    m.get('bodycard') // 返回 120101199901011693  
    m.get('enum','是','否') // 返回 是
    m.get('province') //返回 北京市
  
    // 使用自定义函数生成数据
    m.get('custom', () => 123 + 2);

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

// 使用对象模板生成JSON数据
  var user = m.make({
        realname: "<% cnName %>",
        address: "<% address %>"
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


#### 模块单独使用

可不使用验证模块，仅使用数据生成与模拟模块。

```javascript
  import Maker from 'shai/lib/maker';
  // ES5使用 const Maker = require('shai/lib/maker');

  var m = new Maker();
  console.log(m.get('cnName'));
  // ……
```

#### 数据生成方法类型：

| Key Name  | 说明  | 
| --------------------- | --------------------- |
| **基本数据生成**  |   | 
| uuid                  | UUID，以时间为因子。可选1个参数，为指定分隔符号，默认为-符号 |
| md5                   | MD5，可选2个参数，参数1为指定生成密码内容，参数2为是否为16位，默认32位 |
| now                   | 当前时间，可选1个参数，为指定格式，如now('yyyy-MM-dd hh:mm:ss') |
| increment             | 递增整数，可选2个参数，参数1为步长，参数2为左补位0的个数 |
| regexp                | 自定义正则，可选参数为字符串表达式 |
| custom                | 自定义方法，参数为通过add方法函数进行索引的key名，string |
| **模拟数据**|   | 
| enum                  | 自定义范围随机取值，参数为枚举，如enum('a','b','c'), 参数N个 |
| bool                  | 布尔，true或false |
| color                 | 颜色，如 #000FFF |
| **数字类**|   | 
| int                   | 整数，可选2个参数，参数1为下限值，参数2位上限值 |
| number                | 数字，可选3个参数，参数1为下限值(整数)，参数2位上限值(整数)，参数3为小数位数(整数) |
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
| english               | 英文，可选2个参数，参数1为备选随机英文字串，参数2为长度 |
| chinese               | 中文，可选2个参数，参数1为备选随机中文字串，参数2为长度 |
| text                  | 文本填充，可选3个参数，参数1为文本，参数2为显示次数或为随机下限值，参数3为随机上限值 |

---------

#### 补充说明

Http请求拦截、API模拟、二进制数据等，可结合其它库来使用：<br>

* [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) <br>
* [json-server](https://github.com/typicode/json-server) <br>
* [holder](https://github.com/imsky/holder) <br>
* [dummyimage](https://dummyimage.com/) <br>
* [JsBarcode](https://github.com/lindell/JsBarcode) <br>
* [qrcode](https://github.com/PaulKinlan/qrcode) <br>
* [randomColor](https://github.com/davidmerfield/randomColor)


------

## 数据验证

```javascript
import shai from 'shai';

var v = new shai.Valitator();
// ……
```

**v.check(value:any, ruleName:string, ...args:Array)** 单项数据，单规则验证，返回值为是否通过(boolean)

###### check 参数说明：

> 参数1为验证目标数据，参数2为规则，可选，默认为最少一个任意字符 


**v.checkItem(option:{value:string, foramt:object, callback:Function, rquire:boolean})**  单项数据，组合规则验证，返回值为是否通过(boolean)


###### checkItem 参数选项(option)说明：

> 属性 ***value***，**必须**。 <br>
> 属性 ***format***，链式检查。见v.type……的用法<br>
> 属性 ***callback***，验证回调函数，可选，参数为未通过的项的数组。 <br>
> 属性 ***rquire***，可选，值为false时，值为空或null,验证结果为true。 <br>
> 例：{ value:'password1', format: password.eq('password2').minlength(6).maxlength(20) }

**v.checkItems(itemsArray)**  多项数据，组合规则验证，返回值为是否通过(boolean)

**v.checkJSON(json:string|object, struct:object, callback:Function)**  JSON数据验证，返回值为是否通过(boolean)

###### checkJSON 参数选项(json, struct, callback)说明：

> 参数1为数据，文本或对象均可，**必须** <br>
> 参数2为数据类型结构，参考代码示例，**必须** <br>
> 参数3为可选，回调方法，含2参数，未通过项的组、数据层级路径组。

**v.type**  链式验证对象，注：不可简写，因为定义过程就是实例化。

> 使用的规则为正则或函数，形参长度1的，如例：v.type.string.chinese <br>
> 使用的规则为函数2形参的，例：v.type.eq('123456'); <br>
> 多于2形参，值为数组,例：v.type.between([10,20]) <br>

##### 用法例子：

```javascript
    import shai from 'shai';
    // ES5使用 const shai = require('shai');

    var v = new shai.Valitator();

    // 单项单规则验证
    v.check('password1','eq','password2'); // 返回false
    v.check('120101199901011693','bodycard'); // 返回true

    // 自定义验证规则，函数要求有返回值
    v.check('3', 'custom', val => val.length > 1 && val.length < 5);

    // 单项组合规则验证，链式
    v.checkItem({
        value: 'yr qw2{O',
        format: v.type.eq('yr qw2{O'),
        callback: faults => {
          if (faults.indexOf('eq') === -1) console.log('密码二次验证OK！');
          faults.forEach(f => {
            if (f === 'eq') console.log('二次密码错误');
            if (f === 'myfnc') console.log('不在值6与10之间');
          });
        }
      });

    // 多项组合规则验证
    v.checkItems([
        {value:'123456', format: v.type.int},
        {value:'password1', format: v.type.password.eq('password2')}
    ]);

    // JSON数据类型验证，链式，可任意层级。
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
      name: v.type.chinese.address,
      address: v.type.string,
      age: v.type.int.eq(30),
      looks: {
        size: {
          foot: v.type.int
        }
      },
      hobby: v.type.array,
      notes: [
        { content: v.type.number,
          log: [
            {
              'local.time': v.type.date
            }
          ]
        }
      ]
    };

    var result = v.checkJSON(json, struct);
    console.log(result);

```

#### 模块单独使用

可不使用生成模拟数据模块，仅使用数据验证模块。

```javascript
  import Validator from 'shai/lib/validator';
  // ES5使用 const Validator = require('shai/lib/validator');

  var v = new Validator();
  console.log(v.check('abc'));
  // ……
```

#### 数据验证规则类型


| Key Name  | 说明  | 
| -------------------- | -------------------- |
| **基本类型验证**  | （建议配合checkJSON使用） | 
| object               | 对象 |   
| array                | 数组 | 
| number               | 数字 | 
| string               | 文本 | 
| boolean              | 布尔 | 
| null                 | 空值 |
| **数据格式验证**|  | 
| require              | 非空任意字符 |  
| english              | 英文字母 | 
| chinese              | 中文|
| file                 | 合法文件名 |
| image                | 合法图像文件名 |
| word                 | 合法文档文件名 |
| upper                | 有大写 |
| lower                | 有小写 |
| **数字类**|  | 
| currency             | 货币，2小数，带分号|
| float                | 数字 |
| int                  | 整数 |
| decimal              | 小数点1位及以上 |
| percent              | 百分数，可两位小数点 |
| even                 | 偶数 |
| odd                  | 奇数 |
| **时间类** |  | 
| date                 | 日期 2017-7-7或2017/7/7，0补位非必须，含大小月、闰月检测  |
| time                 | 时间 12:12:12，分秒个位须0补位 |
| datetime             | 日期 + 时间 如2017-07-07 12:02:02, 0补位非必须 |
| year                 | 年份 1900-2099 |
| month                | 月份 1-12，不带补位，下同 |
| day                  | 日 1-31 |
| hour                 | 小时 0-23 |
| minute               | 分钟 0-59 |
| **账号/网络类** |  | 
| qq                   | QQ号 5-11位 | 
| age                  | 年龄 0-129岁 | 
| zipcode              | 邮编 | 
| mail                 | 邮箱地址 |
| url                  | 网址 |
| account              | 账号名 |
| password             | 密码 |
| safe                 | 安全敏感字符 |
| mobile               | 手机13700000000，融合2017新号规则, +86、86可选 |
| telphone             | 电话手机混合 |
| phone                | 固话，可带分机, +86、86可选 |
| bodycard             | 身份证，含地区、生日、验证数等规则 |
| address              | 住址 |
| ip                   | IP地址 |
| ipv6                 | IPV6地址 |
| port                 | 端口 |
| **商业类** |  | 
| bizcode              | 统一信用代码  |
| invoice              | 增值税发票代码 |
| aeo                  | 海关AEO编码   |
| bankcard             | 银行卡号（仅限国内卡）|
| isbn                 | 书号（仅限13位）|
| approval             | 审批文号 政字〔2004〕第18号 或 政字[2004] 18号 |
| **区域类**|  | 
| citycode             | 地区代码
| autocard             | 车牌号码，支持新能源车牌号及港澳等 |
| lon                  | 地理位置——经度，小数点1~15位 |
| lat                  | 地理位置——纬度，小数点1~15位 |
| **编码类**|  | 
| ascii                | ASCII码 |
| base64               | BASE64码 |
| md5                  | md5码 |
| uuid                 | UUID码 |
| dbc                  | 全角 |
| hex                  | HEX码 |
| color                | 颜色码，16进制 |
| htmltage             | 是否为Html标签|
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
| minlength            | 最小长度 |
| maxlength            | 最大长度 |
| length               | 等于长度 |
| in                   | 是否包含，字符、数组元素、对象属性 |
| **自定义**  |  | 
| regexp                  | 自定义正则判断 |
| custom               | 自定义函数方法判断，允许一个参数，即要判断的值 |


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
	  
      console.log(v.check('1111'));
	  
    </script>
</head>
<body>
</body>
</html>
```

