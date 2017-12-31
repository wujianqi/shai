# 数据生成与验证工具库 SHAI library

安装：

```npm
npm install shai
```

特点：

> 前后台通用，但不支持IE9以下浏览器； <br>
> 针对国人国情定制、使用简单、易扩展； <br>
> 内置数据生成方法60余项，验证方法70余项； <br>
> 改进了部分通用验证正则。 

------


## 数据生成（含模拟）

var shai = new Shai();

**shai.config = {...}**

可选全局配置(option)：

> ***divisionCode***  设定全局的行政区划范围（行政区划代码），不含港澳台  <br>
> ***beginTime***  全局时间范围的开始时间  <br>
> ***endTime***  全局时间范围的结束时间  <br>
> ***baseIncrement*** 自增量基数

**shai.schema(method, ...args)** 获得数据，除md5/uuid外，大部分为模拟数据。

**shai.addSchema**  扩展数据生成方法，正则或函数，函数要求有返回值，参数为字符串或数字、布尔

**shai.make(content, num1, num2)** JSON模板，变量输出为#method, ...arguments#

> 参数1 ***content*** 为简单对象文本； <br>
> 参数2 ***num1*** 可选，为输出数组长度，无参数2为单对象输出，有参数3时则为下限值； <br>
> 参数3 ***num2*** 可选，为数组长度的随机的参考上限值。 <br>
> 注：模版内使用正则需转义且不含限定符#，也可先设定为扩展再来使用。

##### 用法例子：

```javascript
    import Shai from 'Shai';

    var shai = new Shai();
    shai.config = {
        divisionCode: 150401,
        beginTime: new Date('2000/1/1'),
        endTime: new Date('2017/12/12')
    };

    // 扩展数据生成方法
    shai.addSchema({
        'newrule': /abc/, 
        'mydata': test => test += 123
    });

    shai.schema('cnName') // 返回 张伟
    shai.schema('bodycard') // 返回 120101199901011693  
    shai.schema('range','是','否') // 返回 是
    shai.schema('province') //返回 北京市

  // 使用模板生成JSON数据
  var user = shai.make(`{
      "realname": "#cnName#",
      "address": "#address#",
      "log": ${shai.make(`{
          "id_#increment#": #int,0,200#,
          "date": #date#,
          "condition": "#range,开始,启用,停止#"
        }`,10)}
      }`);

    console.log(user);

  // 不使用模板生成JSON数据
  var user = {
        realname: shai.schema('cnName'),
        address: shai.schema('address'),
        log: []
    };
    for (let i = 0; i < 20; i++) {
        user.log.push({
            "id_" +  shai.schema('increment'): shai.schema('int', 0, 200)
            date: shai.schema('date'),
            condition: shai.schema('range','开始','启用','停止')
        });
    }
    console.log(JSON.stringify(user));

```

#### 数据生成方法类型：

常用数据生成

* **uuid**          UUID，以时间为因子。可选1个参数，true或false，是否去除-符号
* **md5**           MD5，可选2个参数，参数1为指定生成密码内容，参数2为是否为16位，默认32位
* **now**           当前时间，可选1个参数，为指定格式，如now('yyyy-MM-dd hh:mm:ss')
* **increment**     递增整数，可选2个参数，参数1为步长，参数2为左补位0的个数

模拟数据生成

* **exp**           自定义正则，可选参数为表达式，无参数则为随机字符
* **int**           整数，可选2个参数，参数1为下限数，参数2位上限数
* **number**        数字，可选3个参数，参数1为下限数，参数2位上限数，参数3为小数位数
* **range**         自定义范围随机取值，参数为枚举，如range('a','b','c'), 参数N个
* **validcode**     验证随机数，可选1个参数，位数
* **bool**          布尔，true或false
* **date**          日期，如 2017-11-11
* **time**          时间，如 11:11:08
* **year**          年
* **month**         月
* **day**           日
* **hour**          时
* **minute**        分
* **second**        秒
* **datetime**      时间，可选1个参数，为指定格式，如datetime('yyyy-MM-dd hh:mm:ss')
* **zipcode**       邮编
* **bizcode**       统一信用编码
* **english**       英文，可选2个参数，参数1为备选随机英文字串，参数2为长度
* **chinese**       中文，可选2个参数，参数1为备选随机中文字串，参数2为长度
* **text**          文本填充，可选3个参数，参数1为文本，参数2为显示次数或为随机下限值，参数3为随机上限值。
* **bankcard**      银行卡号
* **price**         价格，可选参数1为下限数，可选参数2为上限数，可选参数3为是否带分号, true或false
* **mid**           商品、产品型号或编号
* **company**       企业名称
* **comDep**        企业部门名
* **comPos**        企业职位名
* **govDep**        政府部门名称
* **govPos**        政府职位名
* **account**       账号名
* **password**      密码
* **color**         颜色，如 #000FFF
* **url**           网址
* **mail**          邮箱
* **mobile**        手机
* **telphone**      固定电话，电话区号将在后续版本按所属地区的方式改进
* **enName**        英文姓名
* **enMaleName**    英文姓名 男
* **enFemaleName**  英文姓名 女
* **cnName**        中文姓名
* **cnMaleName**    中文姓名 男
* **cnFemaleName**  中文姓名 女
* **enState**       英文国名
* **cnState**       中文国名
* **citycode**      行政代码
* **province**      省
* **prefecture**    市州盟，division为省级，可循环所属市名称
* **county**        县区，division为省或市级，可循环所属县区名称
* **lon**           地理位置，经度，division为省或市级，取当前市内位置，可选1个参数，为小数位数
* **lat**           地理位置，纬度，division为县级，取当前县级内位置，可选1个参数，为小数位数
* **address**       住址，当前县/区+路+号+...等
* **sex**           性别
* **nation**        民族
* **affiliate**     政治面貌
* **edu**           学历
* **mary**          婚姻状况
* **health**        健康状况
* **bodycard**      身份证，当前区划+当前全局时间范围内的生日+...
* **autocard**      车牌号码，当前省简称+随机牌号, 地市车牌后续版本再改进

------

## 数据验证

**shai.addRule**  扩展验证规则，正则或函数，参数任意

**shai.check(value, rule, ...args)** 单项数据，单规则验证，返回值为是否通过(boolean)

**shai.checkItem(option)**  单项数据，组合规则验证，返回值为是否通过(boolean)

**shai.checkItems(itemsArray)**  多项数据，组合规则验证，返回值为是否通过(boolean)

**shai.checkData(struct, data, callback)**  JSON、对象数据验证，返回值为是否通过(boolean)

**shai.t**  链式验证对象

###### check 参数说明：

> 参数1为验证目标数据，参数2为规则，可选，默认为最少一个任意字符 

###### checkItem 参数选项(option)说明：

> 属性 ***value***，**必须**。 <br>
> 属性 ***rule***，链式检查，可选。 <br>
> 属性 ***callback***，验证回调函数，可选，参数为未通过的项的数组。 <br>
> 属性 ***rquire***，可选，值为false时，值为空或null,验证结果为true。 <br>
> 动态属性，可选，键为任意规则名，值：规则为正则或函数形参长度1的，为true或false, 函数2形参，等于值，多于2形参，值为数组。 <br>
> 例：{ value:'password1', password:true, eq:'password2', minl:6, maxl:20 ... }

###### checkData 参数选项(option)说明：

> 参数1为数据类型结构，参考代码示例，**必须** <br>
> 参数2为数据，**必须** <br>
> 参数3为回调方法，含2参数，未通过项的组、数据层级路径组。

##### 用法例子：

```javascript
    import Shai from 'Shai';

    var shai = new Shai();
    
    // 扩展验证规则，函数要求有返回值，最少一个引用数据的参数
    shai.addRule({
        'newrule': /abc/,
        'myfnc': 'test':(val, n1, n2)=> val.length > n1 && val.length < n2
    });

    // 单项单规则验证
    shai.check('password1','==','password2'); // 返回false
    shai.check('120101199901011693','bodycard'); // 返回true

    // 单项组合规则验证，动态属性方式
    shai.checkItem({
        value:'afdsD12$',
        password:true,
        test:[6, 10]
    });

    // 单项组合规则验证，链式
    shai.checkItem({
        value: 'yr qw2{O',
        rule: shai.t.eq('yr qw2{O').myfnc(6, 10),
        callback: faults => {
          if (faults.indexOf('eq') === -1) console.log('密码二次验证OK！');
          faults.forEach(f => {
            if (f === 'eq') console.log('二次密码错误');
            if (f === 'myfnc') console.log('不在值6与10之间');
          });
        }
      });

    // 多项组合规则验证
    shai.checkItems([
        {value:'123456', int:true, max:200000},
        {value:'password1', password:true, eq:'password2'}
    ]);

    // JSON、对象数据类型验证，链式，可任意层级。
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
      name: shai.t.chinese.address,
      address: shai.t.string,
      age: shai.t.int.eq(30),
      looks: {
        size: {
          foot: shai.t.int
        }
      },
      hobby: shai.t.array,
      notes: [
        { content: shai.t.number,
          log: [
            {
              'local.time': shai.t.date
            }
          ]
        }
      ]
    };

    var result = shai.checkData(struct, json);
    console.log(result);

```

#### 独立使用

生产环境可独立使用数据验证模块，需单独引用，API相同。

```javascript
    import Validator from './node_modules/shai/lib/validator.js';

    var valid = new Validator();

    valid.addRule({'newrule': /abc/});
    valid.check('password1','==','password2');
```

#### 数据验证规则类型

基本类型验证

* **json**
* **object** 
* **array** 
* **number** 
* **string**
* **boolean**  
* **empty**       null或[]、''

格式验证

* **rquire**      任意字符，必填项
* **english**     英文字母
* **qq**          QQ号 5-11位
* **age**         年龄 0-129岁
* **zipcode**     邮编
* **ip**          IP地址
* **ipv6**        IPV6地址
* **port**        端口
* **bizcode**     统一信用代码
* **invoice**     增值税发票代码
* **bankcard**    银行卡号（仅限国内银联卡号）
* **currency**    货币，2小数，带分号
* **float**       数字
* **int**         整数
* **decimal**     小数点1位及以上
* **percent**     百分数，可两位小数点
* **even**        偶数
* **odd**         奇数
* **chinese**     中文
* **mail**        邮箱地址
* **url**         网址
* **account**     账号名
* **password**    密码
* **safe**        安全敏感字符
* **dbc**         全角
* **hex**         HEX码
* **color**       颜色码，16进制
* **ascii**       ASCII码
* **base64**      BASE64码
* **md5**         md5码
* **uuid**        UUID码
* **mobile**      手机13700000000，融合2017新号规则, +86、86可选
* **telphone**    电话手机混合
* **phone**       固话，可带分机,  +86、86可选
* **date**        日期 2017-7-7或2017/7/7，0补位非必须，含大小月、闰月检测
* **time**        时间 12:12:12，分秒个位须0补位
* **datetime**    日期 + 时间 如2017-07-07 12:02:02, 0补位非必须
* **year**        年份 1900-2099
* **month**       月份 1-12，不带补位，下同
* **day**         日 1-31
* **hour**        小时 0-23
* **minute**      分钟 0-59
* **second**      秒钟 0-59
* **file**        合法文件名
* **image**       合法图像文件名
* **word**        合法文档文件名
* **lon**         地理位置——经度，小数点1位及以上
* **lat**         地理位置——纬度，小数点1位及以上
* **approval**    审批文号 政字〔2004〕18号 或 政字[2004]18号
* **citycode**    地区代码
* **bodycard**    身份证，含地区、生日、验证数等规则
* **autocard**    车牌号码，支持新能源车牌号及港澳等
* **upper**       有大写
* **lower**       有小写

比较

* **not**         不等于，可使用!=替代
* **eq**          等于，可使用==替代
* **gt**          大于，可使用>替代
* **gte**         大于或等于，可使用>=替代
* **lt**          小于，可使用<替代
* **lte**         小于或等于，可使用<=替代
* **bet**         之间，大于并小于
* **min**         最小
* **max**         最大
* **minl**        最小长度
* **maxl**        最大长度
* **len**         等于长度
* **in**          是否包含，字符、数组、对象（仅key）

------

## 其他相关

数据查询与操作

* [object-path](https://github.com/mariocasciaro/object-path) 
* [GraphQL](https://facebook.github.io/graphql/)

API请求模拟：

* [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) 
* [json-server](https://github.com/typicode/json-server)

图片占位符：

* [holder](https://github.com/imsky/holder)

条形码与QR码：

* [JsBarcode](https://github.com/lindell/JsBarcode)
* [qrcode](https://github.com/PaulKinlan/qrcode)

颜色生成：

* [randomColor](https://github.com/davidmerfield/randomColor)
