import 'mocha';
import assert from 'power-assert';
import shai from '../src/index';

describe('数据验证测试 shai valid', function () {
  var v = new shai.Validator({
    isdev: true
  });

  it('属性路径方式', function () {
    var json = {
      "name": "张三",
      "age":30,
      "looks":{
        "size": {
          "foot": 41.5
        }
      }
    }

    v.add('foo', val => {
      return val < 30;
    }, '必须大于30')

    var chain = v.check(json, 'age').number.int
    .ok('int',() => console.log(1,'整数验证通过'))
    .on(fault => { // 验证成功则不执行
        let hasInt = Object.keys(fault).includes('int');
      
      if (!hasInt) console.log(2,'整数验证通过');
    });
    assert(chain.result);

  var chain = v.check(json, 'looks.size.foot').number
    .custom('foo').name('自定义数据')
    .on('custom',() => console.log(3, '验证没有通过'))
    .on(fault => {
       // console.log(4, fault);
    });

    //console.log(chain.rules());
    assert(!chain.result);
  });

  it('verify 数据验证', function () {
     var json = `{
      "name": "张三",
      "address": "南山区后海大道110号",
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
          },
          {
            "local.time": "2012-12-06"
          }]
        },
        {
          "content": "dddddd",
          "log": [{
            "local.time": "2032-12-02"
          }]
        },
        {
          "content": "ddvvvd",
          "log": [{
            "local.time": "2032-16-02"
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

    var struct = {
      name: v.string.chinese.name('姓名').in(['李四','王五']).target('姓名组'),
      address: v.string.address,
      age: v.number.int,
      hobby: v.string.minlength(6),
      looks: {
        size: {
          foot: v.number.int.between(10,20)
        }
      },
      notes: [
        { 
          log: [
            {
              'local.time': v.string.date
            }
          ]
        }
      ]
    };
    
    assert(!v.verify(json, struct));

  });

  var d:object = {
    txtusername: "",
    txtpassword: null,
    validcode: ""
  }

  it('null test', function () {
    assert(v.verify(d,{
      txtpassword: v.null
    }));
  });

  it('blank space test', function () {
    assert(v.verify(d,{
      txtusername: v.string
    }));
  });

  /* it('prop test', function () {
    assert(!v.verify(d,{
      aaaa: v.null
    }));
  }); */

  it('normal test', function () {
    assert(!v.verify(d,{
      txtusername: v.string.required,
      txtpassword: v.null
    }));
  }); 

}); 