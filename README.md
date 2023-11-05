
## 数据生成与模拟工具库

------

![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/dist/index.mjs?label=generator)
![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/dist/access.mjs?label=access%20size)
![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/dist/mock.mjs?label=mock%20size)
![GitHub file size in bytes](https://img.shields.io/github/size/wujianqi/shai/dist/region.mjs?label=region%20size)
![npm type definitions](https://img.shields.io/npm/types/shai)
![npm](https://img.shields.io/npm/v/shai)  

本库介绍 ：  
- [x] 本库含4个子项，均可独立使用。见各子项引用示例及说明。   
- [x] 子项1，JSON数组数据生成，支持**多级自嵌套**、指定数量、随机数量生成。   
- [x] 子项2，快速模拟数据的增、删、改、查，**仿数据记录集CRUD**。    
- [x] 子项3，常用模拟数据工具库，含44项方法，**轻量级**，文件小。  
- [x] 子项4，区域数据模拟，可到区县级，生成**对应地区范围的经纬度、电话**等信息。  
- [x] 库为 ES6，前后端通用，无其它依赖包。  

------

##### 安装：&nbsp; &nbsp; [Demo](https://code.juejin.cn/pen/7297611369761734666)    
 

```npm
npm install shai -D
```

-------

### JSON数组生成

##### 引用库模块及基本用法示例：

```javascript

import Shai from 'shai';
import { web, rand } from 'shai/mock';

const { use, gen } = new Shai();

gen({
  setting: 2,
  username: use(web.account), //use对象，为对应生成数据的函数方法，可以自定义
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

##### 批量对象生成设定规则
* **setting: number** 设定生成普通数组的长度，值为指定数目。  
* **setting: [number, number]** 设定生成普通数组的随机长度，值为区间下限及上限数。  
* **setting: object** 生成自嵌套数组。属性如下：  

> length 子对象数组长度，值为数字，为指定长度，值为2个数字的数组，则为2个数字之间的随机值，不设定则默认1。  
> key 子对象组的属性名，不设定则默认为children。  
> level 子对象组的的层级数目，不设定则默认1。   
>  
> 提示：嵌套数据层数请谨慎设置，如：setting:{length: 15, level:5}，那么产生的记录是70多万条！为**指数级**。  
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
-------

### 仿数据集数组操作（access）

##### 仿数据记录集CRUD操作方法说明  

> 对数组数据，快速仿数据记录集CRUD操作。用法见下面示例。
> 数据操作不成功，一律返回undefined  

* **create**(params)      新增单条或多条记录，返回该条新记录  
* **read**(query, mergeObj)  查询单条记录，返回该条记录，可选合并到第二参数对象  
* **update**(params)      修改单条记录，并返回修改后该行记录 
* **delete**(query)      删除单条或多条记录，返回成功删除数据的索引值数组  
* **list**(query?)        普通列表，可选过滤数据的查询条件  
* **pageList**(query, queryKeys? returnKeys?)    分页列表，可选过滤数据的查询条件，查询对象分页属性必需有当前页码、数量，可选参数2为指定查询参数的页码、数量键名配置选项，可选参数3为指定输出对象的键名配置选项。  

> access.config 全局属性配置说明：

* **uniqueKey**?: string 不重复索引属性名称，默认: id  
* **uniqueType**? number 索引键类型increment(0)或uuid(1)，默认: 0  

> access.data 数据设值

##### 更多数据生成用法示例：


```javascript
import Generator, { cn, text, util, rand } from 'shai'; 
import Access from 'shai/access'; 

const { use, gen } = new Generator();
const access = new Access();
var im1 =  util.incre();

// 模拟数据
access.data = gen({
  setting: 20,
  id : use(im1.val),
  username : use(web.account),
  password : use(web.password)
});

let dt = access.create({ username: 'admin', password: '123456'});
console.log("新增数据是否成功", dt)

dt = access.read({ username: 'admin', password: '111' })
console.log("是否存在", dt)

dt = access.update({id: 10, username: 'admin2', password: '222222'})
console.log("更新是否成功", dt)

dt = access.delete(['11', '28'])
console.log("删除是否成功", dt)

dt = access.list()
console.log("获取数据列表", dt)

dt = access.pageList({ pageSize: 8, pageIndex: 1 })
console.log("获取分页数据列表", dt)

```

-------


### 常用数据模拟

##### 用法示例：

```javascript
import { rand, util, cn, en, web, text, date } from 'shai/mock'; 

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
time | 随机时间| 可选前2个参数为限定时间范围，参数1，开始时间，参数2，结束时间。<br>可选参数3为格式化样式YYYY/MM/DD HH:mm:ss，输出为string。  
now | 当前时间 | 可选参数1为格式化样式YYYY/MM/DD HH:mm:ss, 输出为string。  
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
url | 网页地址 | 可选参数1，为协议名前缀，如https、ws
email | 邮编 | 
ip | IPV4地址 | 可选参数1，为局域网IP
color | 颜色值 | 

-------

### 区域数据模拟（仅限中国大陆地区）
> 数据生成方式：同区划级别范围内循环。  
> 更新于2020.10月 [民政部数据](http://www.mca.gov.cn/article/sj/xzqh/2020/)。  

##### 用法示例：  

```javascript
import Region from 'shai/region'; 

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

##### 更多模拟库推荐

如果本库不能满足需求，可结合以下库来组合开发。

* 正则模拟： [randexp](https://github.com/fent/randexp.js)  
* 颜色随机： [random color](https://github.com/davidmerfield/randomColor)  
* 图片数据：[holder](https://github.com/imsky/holder)  
* axios请求拦截： [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)  
* API服务模拟： [msw](https://github.com/mswjs/msw)   
* API服务模拟： [json-server](https://github.com/typicode/json-server)   

