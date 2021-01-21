
## 数据生成与模拟工具库

------

![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/es/shai.js?label=shai%20size)
![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/es/mock.js?label=mock%20size)
![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/es/region.js?label=region%20size)
![npm type definitions](https://img.shields.io/npm/types/shai)
![npm](https://img.shields.io/npm/v/shai)  

本库介绍 ：  
- [x] 本库含3个子项，均可独立使用。见各子项引用示例及说明。  
- [x] 子项1，数组生成及CRUD模仿器，支持**多级自嵌套**、指定数量、随机数量生成。  
- [x] 支持**仿数据记录集CRUD**，快速模拟数据的增、删、改、查等Restful API功能。  
- [x] 子项2，常用模拟数据工具库，含44项方法，**轻量级**，文件小。  
- [x] 子项3，区域数据模拟，可到区县级，生成**对应地区范围的经纬度、电话**等信息。  
- [x] 库最低支持ES5，前后端通用，无其它依赖包。  

------

##### 安装：&nbsp; &nbsp; [Demo1（简单模拟）](https://175.io/demo/demo2.html) &nbsp; &nbsp; [Demo2（区划）](https://175.io/demo/demo3.html)   
 

```npm
npm install shai -D
```

-------

### 数组生成及CRUD模仿器

##### 引用库模块及基本用法示例：

```javascript

import Shai from 'shai';
import { web, rand } from 'shai/es/mock'; // 也可以选用第三方库

const { use, gen } = new Shai();

gen({
  setting: 2,
  username: use(web.account),
  password: use(web.password)
})
/* 生成结果（普通数组）：
[
  { username: Gdda-3ef, password: dje^Ip&d }, 
  { username: PjKL3m4Y, password: jeF2s@ko }
]
*/

gen({
  setting: {level: 2},
  num: use(rand.int)
})
/* 生成结果（自嵌套）：
{
  num:13, 
  children:[{
    num:7,
    children: [{
      num:29
    }]
  }]
}
*/
```

------

##### 数组数据生成方法说明

* **use**(func, ...args)  第1个参数为所使用生成数据的方法函数，第2到n个参数为函数的实参设值。  
* **gen**(data, propKey?) 第1个参数为设定了相关规则的数据对象，第2个为自定义选项的键名（默认为setting）。 
* **access** 对gen生成的数据，进行仿数据记录集CRUD操作对象，详见下面“仿数据记录集CRUD操作方法说明”相关内容

##### 批量对象生成设定规则
* **setting: number** 设定生成普通数组的长度，值为指定数目。  
* **setting: [number, number]** 设定生成普通数组的随机长度，值为区间下限及上限数。  
* **setting: object** 生成自嵌套数组。属性如下：  

> length 子对象数组长度，值为数字，为指定长度，值为2个数字的数组，则为2个数字之间的随机值，不设定则默认1。  
> key 子对象组的属性名，不设定则默认为children。  
> level 子对象组的的层级数目，不设定则默认1。   
>  
> 提示：嵌套数据层数请谨慎设置，如：setting:{length: 15, level:5}，那么产生的记录是813615条！为**指数级**。  
> 建议：使用多级数据模版组合，局部或少量采用嵌套。  

##### 更多数据生成用法示例：

```javascript
// 可多级配置节点项
let data = gen({
  setting: 3, // 顶层节点设置
  a: use(cn.fullName),
  b: [
      use(text.chinese),
      {
        setting: {key: 'items'}, // 子节点设置
        d: use(text.chinese),
      }
  ]
})
console.log(data);

// 使用不同的对象实例，生成不同范围的值
let i1 = util.incre();
let i2 = util.incre(2);
let data = gen({
  setting: 3,
  a: use(i1.val),
  b: [
      use(text.chinese),
      use(i2.val)
  ]
})
console.log(data);

// 若setting键名有冲突，可自定义选项键
let data = gen({ myKey: 20, num: use(rand.int) }, 'myKey')
console.log(data);

```

##### 仿数据记录集CRUD操作方法说明  

> 对数组数据，进行仿数据记录集CRUD操作，快速模拟Restful API； 具体用法参考本文后述模拟示例。  
> create, update, delete 参数1为请求对象（必选）, 参数2为成功消息（可选）, 参数3为失败消息（可选）。  
> read, exist 参数1、2、3同上，参数4为合并属性输出（可选）。  
> list 参数1为请求对象（可选）, 参数2为成功消息（可选），没有失败，没数据返回空数组。 
> pageList 同上，但查询参数需有2个属性：当前页码，每页条数；返回值除对象数组外，再包裹了层统计属性。  

* **create**(params, successMsg, errMsg)      新增单条或多条记录  
* **read**(query, successMsg, errMsg, mergeObj)  查询单条记录  
* **update**(params, successMsg, errMsg)      修改单条记录，并返回修改后记录  
* **delete**(query, successMsg, errMsg)      删除单条或多条记录，返回删除后数据  
* **exist**(query, successMsg, errMsg, mergeObj) 查询记录是否存在，并返回该记录  
* **list**(query, successMsg)                普通列表，可选过滤数据的查询条件  
* **pageList**(query, successMsg)    分页列表，可选过滤数据的查询条件  
* **async** (methodName, ...args )  异步数据（本地模拟使用），参数一为上述方法名，参数二起同上，最后一个参数为延时时长。  

> access.config 全局属性配置说明：  

* **uniqueKey**?: string 不重复索引属性名称，默认: id  
* **uniqueType**? number 索引键类型increment(0)或uuid(1)，默认: 0  
* **api**?: object 自定义API接口属性项，参见后面示例  
* **page**?: object 自定义分页属性项，参见后面示例  

-------

### 常用数据模拟

##### 用法示例：

```javascript
import { rand, util, cn, en, web, text, date } from 'shai/es/mock'; 
// ES5 引用 const { rand, util, cn } = require("shai/lib/mock");

console.log(rand.str(2, '测试看看'));
console.log(cn.fullName());

```

###### rand 基本随机方法。  
> 随机的基础方法  

方法名 | 用途 | 参数说明
-|-|- 
int | 随机整数 | 可选2个参数为限定数字区间
number | 随机数字，含浮点数 | 可选前2个参数为限定数字区间，可选第3个参数为小数点位数。
pick | 随机选择数组项中1个或多个 | 必选参数1为数组内容，可选参数2为选择项数目，没有则默认1个。
str | 随机字符串 | 可选参数1为选择字符数目，默认10，可选参数2为限定字符串内容。
bool | 随机真假值 | 
once | 随机有或无(空白) | 必选参数1为随机字符串内容。
letter | 随机字母 | 可选参数1为选择字符数目，默认10，可选参数2为是否限定为大写字母，默认否。可选参数3为是否大小写混合，默认是。
numstr | 随机数字字符串 | 可选参数1为选择字符数目，默认10。
alphanum | 随机字母+数字 | 可选参数1为选择字符数目，默认10，可选参数2为是否限定为大写字母，默认否。
plus | 随机扩展字符，即大小写+数字+扩展 | 必选参数1为字符数目，默认10，必选参数2为所扩展的字符内容。
hex | 随机16进制字符 | 可选参数1为选择字符数目
shuffle | 随机打乱字符或数组位置 | 必选参数1为指定内容

###### date 时间  
> 时间数据生成   

方法名 | 用途 | 参数说明
-|-|- 
time | 随机时间| 可选前2个参数为限定时间范围，参数1，开始时间，参数2，结束时间。<br>可选参数3为格式化样式yyyyMMdd hh:mm:ss，输出为string，<br>无参数3则为Date类型。  
now | 当前时间 | 可选参数1为格式化样式yyyyMMdd hh:mm:ss，输出为string，<br>无参数则为Date类型。  
year | 年，数字 | 
month | 月，数字 | 
day | 天，数字 | 
hour | 时，数字 | 
minute | 分，数字 | 

###### util 格式数据生成
>  特定格式数据生成  

方法名 | 用途 | 参数说明
-|-|- 
incre | 自增数 | 可选参数1为自增步长，<br>可选参数2为基数，返回对象为Increment的实例，<br>获取值的方式：util.incre().val()
range | 区间数 | 必选参数1为下限数字，必选参数2为上限数字，<br> 可选参数3位步长
uuid | GUID / UUID | 以时间为因子生成的UUID，可选参数1位连接符，默认为-， 也可以空白

###### text 文本块
> 文本块生成  

方法名 | 用途 | 参数说明
-|-|- 
repeat | 重复文本块 | 可选参数1为重复次数，默认10，可选参数2为指定文本内容。
chinese | 中文文本块 | 可选参数1为文本长度，默认10

###### cn 中文地区、公司、个人信息
>中文地区、公司、个人信息数据生成  

方法名 | 用途 | 参数说明
-|-|- 
firstName | 姓 |
maleName | 男性 名字 | 
femaleName | 女性 名字 | 
fullName | 全称名字，含男女 | 
country | 国名 |
company | 公司名称 | 
mobile | 手机号码 | 
road | 路名 | 
build | 建筑物名 | 
phone | 电话 | 
zipcode | 邮编 | 
idcard | 身份证号 | 
autocard | 车牌号 | 

###### en 英文信息
> 同上，仅为英文  

方法名 | 用途 | 参数说明
-|-|- 
firstName | 姓
maleName | 男性 名字 | 
femaleName | 女性 名字 | 
fullName | 全称名字，含男女 | 
country | 国名 |


###### web 网络、账号等信息
> 网络、账号等信息生成

方法名 | 用途 | 参数说明
-|-|- 
account | 账号名 | 
password | 密码 | 
qq | QQ号 | 
domain | 域名 | 
url | 网页地址 | 
email | 邮编 | 
ip | IP地址 | 可选参数1，为局域网IP
color | 颜色值 | 

-------

### 区域数据模拟（仅限中国大陆地区）
> 数据生成方式：同区划级别范围内循环。  
> 更新于2020.10月 [民政部数据](http://www.mca.gov.cn/article/sj/xzqh/2020/)。  

##### 用法示例：  

```javascript
import Region from 'shai/es/region'; 
// ES5 引用 const Region = require("shai/lib/region");
let region = new Region(440300);  // 实例化的参数可选，没有指定则随机全国

console.log(region.longitude());
console.log(region.prefecture());
console.log(region.idcard());

```

方法名 | 用途 | 参数说明
-|-|- 
province | 省直辖市 名称 | 
prefecture | 市州盟 名称 | 可选参数1，是否更新为下一个同级市，默认false不更新。<br>实例参数已指定为市、县级区划则无效
county | 县区 名称 | 可选参数1，是否更新为下一个同级县，默认false不更新。<br>实例参数已指定为县级区划则无效
longitude | 地理坐标，经度 | 
latitude | 地理坐标，纬度 | 
citycode | 县区级6位行政区划代码 | 
phone | 电话 | 
zipcode | 邮编 | 
idcard | 身份证号 | 
autocard | 车牌号 | 

-------

##### 第三方模拟库推荐

如果本库不能满足需求，还可以结合以下库来组合开发。

* 正则模拟： [randexp](https://github.com/fent/randexp.js)  
* 颜色随机： [random color](https://github.com/davidmerfield/randomColor)  
* 图片数据：[holder](https://github.com/imsky/holder)  
* faker：[faker](https://github.com/Marak/faker.js)  
* axios请求拦截： [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)  
* API服务模拟： [json-server](https://github.com/typicode/json-server)  

-------

##### webpack-dev-server 模拟示例

```javascript

/* ---用户数据模拟 mock/user.js----*/
// 注：需用es5模块化、同步方法
// 亦可用在 express

const Shai = require('shai');
const { util, web } = require('shai/lib/mock');

const shai = new Shai();
const access = shai.access;
const im1 =  util.incre();

// 模拟数据
shai.gen({
  setting: 20,
  id: shai.use(im1.val),
  username: shai.use(web.account),
  password: shai.use(web.password)
});

// 可选配置
/* access.config = {
    api: { // 接口属性设定
      statusField: 'code',
      messageField: 'message',
      resultsField: 'data',
      successCode: 0,
      failureCode: 500
    },
    page: { // 分页属性设定
      sizeField: 'pageSize',
      currentField: 'pageIndex',
      countField: 'pageCount',
      totalField: 'total',
      resultsField: 'list'
    }

} */

// 增加静态值便于测试
access.create({ username: 'admin', password: '111111'});

module.exports = function(app) {
  app.post('/api/user/login', function(req, res){
    res.json(access.exist(req.body, '登录成功！', '账号错误!') // 模拟用户登录
  });
  
  app.get('/api/user/getlist', function(req, res) {
    res.json(access.pageList(req.query)); //模拟用户列表分页
  })

  app.post('/api/user/add', function(req, res) {
    res.json(access.create(req.body)); // 新增用户
  })

  app.put('/api/user/update', function(req, res) {
    res.json(access.update(req.body)); // 修改用户
  })

  app.delete('/api/user/delete', function(req, res) {
    res.json(access.delete(Object.values(req.query))); // 删除用户
  })

}

/* ----devServer 配置项----*/
const bodyParser = require("body-parser");
const user = require("./mock/user")

before(app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());  
  user(app);
}

```

##### axios-mock-adapter 模拟示例

```javascript
// 与 Vue React 等框架结合使用
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Shai from 'shai';
import {cn, util} from 'shai/es/mock';
import Region from 'shai/es/region';

export default {
  init() {
    const mock = new MockAdapter(axios);
    const { gen, use, access} = new Shai();
    const region = new Region();
    const id = util.incre();
    const company = ()=> region.prefecture() + cn.company();
    const project = {
        setting: 50,
        id: use(id.val),
        name: use(cn.fullName),
        build: use(cn.build),
        company: use(company)
    };

    gen(project);
    mock.onGet('/project/list').reply(async params => access.async('list', params);
  }
}

```
