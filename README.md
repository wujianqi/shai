<div align=center>

![shai.js](https://github.com/wujianqi/shai/raw/master/svg/logo.svg?sanitize=true) <br>

数据生成模拟、验证工具库

</div>

------

“晒.JS” 简介： 

- [x] 针对国人国情定制、使用简单、易扩展 <br>
- [x] 模拟生成（maker）：内置方法66项，让数据看起来更真实，规则简单 <br>
- [x] 验证（validator）：内置方法85项，链式，结构即类型<br>
- [x] 区划更新到 2019.4 [民政部公示](http://www.mca.gov.cn/article/sj/xzqh/2019/)  <br>
- [x] 前后台通用，0.2.x 支持ES5的版本，0.3.x后续版本为ES6 + 异步 <br>

------

安装：

```npm
npm i shai
```

------

## 数据生成与模拟 ![maker.js](https://github.com/wujianqi/shai/raw/master/svg/maker.svg?sanitize=true) 

```javascript
import shai from 'shai';
var maker = shai.maker;

// 引用独立模块（不含数据验证）
// ES5方式 const maker = require('shai/lib/maker');
// ES6方式 import maker from 'shai/lib/maker.esm'; 
// maker.get(...)...

// 如果需要设定全局选项，则可如下：
maker.setting = {
    divisionCode: '610000',
    beginTime: new Date('1980/06/01'),
    endTime: new Date('2018/06/01')
}
// 或：maker.setting.divisionCode = '610000'
...

```
**.setting = {...}** 数据生成选项配置。

###### setting 选项设置：

> ***divisionCode***  设定全局的行政区划范围（行政区划代码），默认全国（不含港澳台） <br>
> ***beginTime***  全局时间范围的开始时间，默认1970-01-01<br>
> ***endTime***  全局时间范围的结束时间，默认当前时间 <br>
> ***incrementBase***  自增长基数 <br>

**.get(key:string, ...args:array)** 生成数据，包括md5、uuid, 及模拟数据等。

###### get 参数说明：

> 参数1 ***key*** 为方法名； <br>
> 参数2 ***args*** 为可选，方法中的更多参数。<br>

**.add(key:string|function, fn:function)** 添加新的生成数据的方法，配合get('custom', 'key') 使用。

###### add 参数说明：

> 参数1 ***key*** 为方法名； <br>
> 参数2 ***fn*** 为可选，方法函数。<br>

**.make(content:string|object, parseValueType:boolean|string, optionKey:string)** 根据对象或JSON文本模板，生成设值后的新对象

###### make 参数说明：

> 参数1 ***content*** 为JSON模版；string或object，如果本参数是字符串则函数输出为字符串，如果是对象则输出也是对象，**必须**！<br>
> 参数2 ***parseValueType*** 是否需要转换值的类型，默认为true，即转换，可选。注：模板静态数据内容不受此限制。适用范围：对象属性如设为"key": <% int %>则报错, 可改为"key": "<% int %>"，因此类型需要转换；parseValueType 设为false，为保留文本；设为string，则为指定的需转换的方法名，不同的方法名使用,号隔开。<br>
> 参数3 ***optionKey*** 自定义循环输出的对象属性名，默认为makerOption，string，可选，可参考JSON模板说明。<br>

###### 对象或JSON模版 约束规则说明：

> 方法名、参数，使用这种方式：<% int, 0, 2 %>  <br>
> 数组或嵌套数据输出配置，在目标对象里加属性：makerOption（也可自定义，即make的optionKey参数）, 说明如下：<br>
>> 值为“参数”数组，例："makerOption": [2,3,'childrens']。<br>
>> ***数组元素 1***，默认情况下为输出对象的个数，即数组长度，但有数组元素3的情况下，为嵌套的层数；必需项！<br>
>> ***数组元素 2***，默认不设值，当设值后，无数组元素3的情况下，数组元素1变为随机数字的下限值，数组元素2为上限值；有数组元素3的情况下，为嵌套对象的个数，及嵌套对象数组长度；<br>
>> ***数组元素 3***，默认不设值，当设值后，为嵌套对象的属性名，文本<br>

> 模版示例：<br>

```json
{
  "realname": "<% cnName %>",
  "address": "<% address %>",
  "log": {
    "makerOption": [2],
    "id_<% increment %>": "第<% increment,false %>节：<% chinese %>论",
    "condition": "<% enum, 已上架, 已下架 %>",
    "log": {
      "makerOption": [2, 3, "items"],
      "author": "system",
      "time": "<% datetime %>",
      "msg": {
        "code": "<% int, 0, 200 %>"
      }
    }
  }
}

```

##### 用法例子：

```javascript
  import m from 'shai/lib/maker.esm';

  m.get('cnName') // 返回 张伟
  m.get('bodycard') // 返回 120101199901011693  
  m.get('province') // 返回 北京市
  m.get('range, 1, 5') // 返回 1,2,3,4,5
 
  // 使用模板（对象或JSON文本）生成数据
  var user = m.make({
    realname: "<% cnName %>",
    address: "<% address %>",
    log: {
      makerOption: [1, 3],
      "id_<% increment %>": "<% int, 0, 200 %>",
      date: "<% date %>",
      condition: "<% enum, 开始, 启用, 停止 %>"
    }
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

  // 扩展
  m.add('test1', foo => 123 + foo);  // 方式一，推荐
  m.get('custom', 'test1', '234'); 
  m.get('custom', foo => 123 + foo, '234'); // 方式二，但模板中无法使用

  // 自引用示例
  m.add('testv', (a) => { 
    return m.get('increment', false) as number + a;
  })

  // holder图片引用示例
  m.add('image', (str1, str2) => { // 
    return `<img src="holder.js/${str1}x${str2}">`;
  })

  var user = m.make({
    nodeid: "<% custom, testv, 2 %>",
    avatar: "<% custom, image, 80, 80 %>"
  });
  console.log(user);

  // 小技巧
  m.make({
    id: "<% uuid , %>", // 去掉连接符“-”，即第二个参数为空字符串
    test: ["<% range, 1, 5 %>","<% range, 6, 9, 2 %>"] // 字符串转数组，利用类型转换
  },'range'); 


```

##### 与 Vue React 等框架结合使用，本地API模拟示例 <br>

```javascript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import maker from 'shai/lib/maker.esm';

export default {
  init() {
    let mock = new MockAdapter(axios);
    maker.setting.divisionCode = '440300';

    let listData = maker.make({
      makerOption: [50],
      id: "<% uuid %>",
      name: "<% chinese, 10 %>",
      longitude: "<% lon %>",
      latitude: "<% lat %>",
      bytime: "<% datetime %>"
    });

    mock.onGet('/project/list').reply(params => {
      let { name } = params, mockList = listData.filter(d => 
        (name && d.name.indexOf(name) == -1) ? false : true);
    
      return new Promise((resolve, reject) => 
        setTimeout(() => resolve([200, { results: mockList }]), 1000));
    });
  }
}

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
| range                 | 列出区间所有数字，参数1为下限值，参数2为上限值，参数3位步长。输出的数字序列，为逗号隔开的字符串|
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
| enState               | 英文国名（全球GDP前50的国家） |
| cnState               | 中文国名（全球GDP前50的国家） |
| zipcode               | 邮编（依据全局区划） |
| citycode              | 行政代码（依据全局区划） |
| province              | 省（依据全局区划） |
| prefecture            | 市州盟（依据全局区划），division为省级，可循环所属市名称 |
| county                | 县区（限定地区），division为省或市级，可循环所属县区名称 |
| lon                   | 地理位置，经度，（依据全局区划） |
| lat                   | 地理位置，纬度，（依据全局区划） |
| autocard              | 车牌号码（依据全局区划） |
| road                  | 路名 （使用频次最高的路名）|
| build                 | 建筑物名 |
| address               | 地址，当前县/区+路+号+...等 （依据全局区划） |
| phone                 | 固定电话（依据全局区划，自动识别所在城市电话位数，8位或7位） |
| **商业类** |   |
| company               | 企业名称（依据全局区划，使用频次最高的常见字） |
| bizcode               | 统一信用编码 |
| bankcard              | 银行卡号 |
| price                 | 价格，可选参数1为下限数，可选参数2为上限数，可选参数3为是否带分号, true或false |
| mid                   | 型号货号编号，数字字母、中间小横杠组合 |
| job                   | 工作、职业 |
| **账号网络类**|   | 
| esurname              | 英文姓氏 （使用频次最高的英文姓）|
| enName                | 英文姓名 （使用频次最高的英文姓+名）|
| enMaleName            | 英文姓名 男 （使用频次最高的英文姓+男名）|
| enFemaleName          | 英文姓名 女 （使用频次最高的英文姓+女名）|
| surname               | 中文姓氏 （使用频次最高的中文姓） |
| cnName                | 中文姓名 （使用频次最高的中文姓名）|
| cnMaleName            | 中文姓名 男 （使用频次最高的中文姓+男名）|
| cnFemaleName          | 中文姓名 女 （使用频次最高的中文姓+女名）|
| bodycard              | 身份证（依据全局区划、全局时间段） |
| account               | 账号名，字母+数字+连接线，开头字母，**微信号**同此 |
| password              | 密码 |
| mobile                | 手机 |
| url                   | 网址 |
| mail                  | 邮箱 |
| ip                    | IP，可选参数1，是否为局域网IP |
| port                  | 端口 |
| **系统类** |   | 
| file                  | 文件名，参数为指定候选后缀，可选 |
| fieldType             | 常见数据库字段类型，可选参数字符串：mysql或oracle、sqlserver、sqlite |
| **文本块类** |   | 
| alphanum              | 字母+数字组合，可选1个参数，位数，可适用**验证码**等 |
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
* API服务模拟: [json-server](https://github.com/typicode/json-server) <br>
* 图片数据：[holder](https://github.com/imsky/holder) <br>

------

## 数据验证模块 ![validator.js](https://github.com/wujianqi/shai/raw/master/svg/validator.svg?sanitize=true) 

```javascript
import shai from 'shai';

// 引用独立模块（不含数据模拟）
// ES5方式 const validator = require('shai/lib/validator');
// ES6方式 import validator from 'shai/lib/validator.esm'; 
// validator.check(...)...;

var validator = shai.validator;
// ……

// 可选配置项。
validator.setting = {
  isdev: true // 启动控制台输出。  
  message: {  // 修改默认错误消息模板。
    eq: '%n不等于%t'
  }
}; 
// 或 validator.setting.isdev = true;

```

**.setting = {...}** 数据验证选项配置。

###### setting 选项设置：

> ***isdev***  将未通过验证的信息以警告方式在控制台输出<br>
> ***message***  修改错误消息默认模板，%n为name占位符，%t为target占位符。<br>

**.check(data:any, path(string|array))** 单项数据验证，返回值为链式对象，详见链式对象说明。

###### check 参数选项(data, path)说明：

> 参数1为数据，文本或对象均可，**必须** <br>
> 参数2为对象属性路径，当参数1为对象时有效，可选，参考代码示例 <br>

**.string | .number | .object | .array | .boolean | .null**  直接使用链式验证对象。

###### 链式对象说明：

> 1位参数的规则项：eq、not、gt、gte、lt、lte、length、minlength、maxlength、bitmax、in、has、regexp，例：v.string.eq('foo')<br>
> 2位参数的规则项：between，例：v.number.between(10,20)<br>
> 最少1位以上，可变参数的规则项：min、max、custom 例：v.number.min(2,19,10,20)<br>
> 无参数的规则项，均为直接使用属性方式：例：v.string.english.upper <br>
> 链式验证对象支持所有规则任意搭配，但不建议无意义的组合，例：v.null<del>.length(10)</del> <br>
> **.on(rule:string|function, string|function)**，绑定未通过验证的回调函数，用法见示例。<br>
> **.ok(rule:string|function, string|function)**，绑定已通过验证的回调函数，用法见示例。<br>
> **.name(fieldname:string)**，指定数据项名称，用于格式化消息。<br>
> **.target(...targetnames:string[])**，指定比较值的名称，用于1位及以上参数规则格式化消息，见示例。<br>
> 链所有节点仅是索引，不会立即生效的，调用result属性方法才会生效。<br>
> **.result**，获取验证结果，值为boolean。 <br>
> **.rule** 获取async-validator兼容规则，用法见示例。<br>

**.checkItems(chain:array)** 多项数据验证，返回值为是否通过(boolean)，参数为链式对象chain数组。

**.verify(json:string|object, struct:object, callback:function)**  JSON数据或对象验证，返回值为是否通过(boolean)

###### verify 参数选项(json, struct, callback)说明：

> 参数1为数据，文本或对象均可，**必须** <br>
> 参数2为数据类型结构，为链式对象组合（不要调result，会改变对象类型），参考代码示例，**必须** <br>
> 参数3为可选回调方法，含2参数，未通过项的组、数据层级路径组，此方法会覆盖链内有on的集中回调的方法。<br>

**.add(key:string|function, fn:Function, message:string)** 添加验证数据的方法，便于复用，见custom示例与规则说明。

##### 用法例子：

```javascript
  import v from 'shai/lib/validator.esm';

  // 对指定的单项数据验证
  v.check('password1').eq('password2').result; // 返回false
  v.check('120101199901011693').bodycard.length(18).result; // 返回true
  
  // 获取对象路径的值进行验证，支持特殊属性名
  var obj = {notes:[{
      content: "testdsafsdf"
    }]};
  var chain = v.check(obj, 'notes.0.content').string.maxlength(255);
  console.log(chain.result);

  var obj = [{
      note.content: "testdsafsdf"
    }];
  var chain = v.check(obj, [0, 'notes.content']).string.maxlength(255);
  console.log(chain.result);
    
  // 自定义规则方法
  v.add('foo', (val, val2) => val.length === val2.length, '示例格式') // 方式一，推荐
  v.check('123').custom('foo', '456');
  v.check('123').custom((val, val2) => val.length === val2.length, '456'); // 方式二，但回调中无法使用

  // 绑定回调
  var chain = v.check('yrPqw2{O').password.eq('yr qw2{O').minlength(8)
    .on('password', () => console.log(...)) // 未通过验证的回调，单项
    .on(fault => console.log(...)) // 集中回调, 回调函数可带一个参数，即未通过验证项的消息对象
    .ok('password', () => console.log(...)) // 已通过验证的回调，只能按单项。
    .ok(() => console.log(...),'foo') // 自定义函数的回调只要将参数调换个顺序即可，on同此。
  console.log(chain.result);

  //自定义消息（只要写名称就行）
  var chain = v.check('yrPqw2{O').password.name('重复密码') // 设置名称
    .eq('yr qw2{O').target('初始密码') // 设置比较对象名称，可多个，格式化时按顺序替换
    .minlength(8) // 对于数字日期类型，无需写target
  console.log(chain.result);

  // 链式对象组合验证
  var result = v.checkItems([
    v.check('admin').account.length(4),
    v.check('O8g#F23gj').password.minlength(8)
  ]);
  console.log(result);

  // 完整JSON数据或对象验证，可任意层级。
  var json = `{
    "name": "张航",
    "age":30,      
    "hobby":["tour","sing"],
    "notes":[
      {
        "content": "testdsafsdf",
        "log": [{
            "local.time": "2012-12-02"
          }, {
            "local.time": "2012-15-02"
        }]
      }
    ]
  }`;

  var struct = { // 定义类型结构
    name: v.string.chinese.address,
    age: v.number.int.eq(30),
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

##### 兼容 Element、Ant design 等UI框架的 async-validator 的处理

* 作用：简化过多层次的配置、减少或不使用自定义验证，仅验证链有效；
* message，参考name/target/setting设定，注：on的“集中回调”方式无效；
* trigger，为UI库封装，如有需要，可将change、blur写在trigger参数中。

```javascript
  // Element Vue：<el-form :rules="shaiRules"></el-form>
  // Ant design React: <Form.Item>{ getFieldDecorator('age', rules: shaiRules.age) }</Form.Item>
  setField() {
    this.setFieldValue...
  },
  shaiRules: {
    pass: v.string.required.password.length(8).trigger('change').rule,
    age: v.number.gt(23).name('年龄').ok('gt', setField).rule
  }

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
| required             | 必需有值！如果没required，空值可在链对象中直接通过，设值后才会一一判断。| 
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
| account              | 账号名，字母数字下划线连接线组合，首位字母，同**微信号**规则, 但没限制长度 |
| password             | 密码，最少1大写字母、1小写字母、1数字、1特殊字符，没限制长度 |
| mobile               | 手机13700000000，融合2017新号规则, 即包括16/19等开头的，+86、86可选 |
| telphone             | 电话手机混合 |
| phone                | 固话，可带分机, +86、86可选 |
| bodycard             | 身份证，含地区、生日、验证数等规则 |
| address              | 住址 |
| citycode             | 6位地区代码 |
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
| domain               | 合法域名 |
| **商业类** |  | 
| bizcode              | 统一信用代码  |
| invoice              | 增值税发票代码 |
| bankcard             | 银行卡号（仅限国内卡）|
| isbn                 | 书号（仅限13位）|
| approval             | 文号 政字〔2004〕第18号 或 政字[2004] 18号 |
| **编码格式**|  | 
| ascii                | ASCII码 |
| base64               | BASE64码 |
| md5                  | md5码 |
| uuid                 | UUID码，连接线-号可选 |
| hex                  | HEX码 |
| color                | 颜色码，16进制 |
| jwt                  | JSON Web Token字符串|
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
| empty                | 字符、对象、数组是否为空，数字则判断是否小于0 |
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
      var validator = shai.validator;	
	  // 如果引用为http://www.175.io/lib/validator.js，则直接使用validator ，其它类推;
	  
      console.log(validator.check('1111').required.result);
	  
    </script>
</head>
<body>
</body>
</html>
```
