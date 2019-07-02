import 'mocha';
import assert from 'power-assert';
import shai from '../src/index';

describe('数据验证测试 shai valid', function () {
  var v = shai.validator;
  v.setting.isdev = true;
  v.setting.message.minlength = '%n测试%t';
  var data = {
    "name": "张三",
    "address": "南山区后海大道110号",
    "age":30,
    "hobby":["tour", "sing", "eat"],
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
  };

  /* it('同步验证测试', function() {
    v.add('foo', val => {
      return val < 30;
    }, '必须大于30')

    var chain = v.check(data, 'age').number.int
    .ok('int', () => console.log(1,'整数验证通过'))
    .on(fault => { // 验证成功则不执行
        let hasInt = Object.keys(fault).includes('int');
      
        if (!hasInt) console.log(2,'整数验证通过');
    });
    assert(chain.result);
  }); */


  it('异步验证测试', function(done) {
    this.timeout(5000);
    v.add('foo2', (val, val2) => new Promise<boolean>((resolve,reject) => {
      setTimeout(() => {
        resolve(val < 30 && val > val2);
      }, 500);
    }), '%n必须大于%t')

    var chain = v.check(data, 'looks.size.foot').required.number
      .custom('foo2', 20).eq(30).alias('自定义数据')
      //.on('custom',() => console.log(3, '验证没有通过'))
      .on(fault => {
        console.log(fault, 'onhandler');
      });
      chain.asyncResult.then(res => {
        done();
        console.log(res);
        assert(!res);
      }).catch(err => {
        done(err);
      });
  });

  /* it('数据深层验证', function () {
    // var chain = v.check([{a: 123}, {a: 'dasfds'}]).array.each({ a: v.number.int })
    // console.log(chain.result);
    v.setting.isdev = true;
    var struct = {
      name: v.string.chinese.alias('姓名').in(['李四','王五']).target('姓名组'),
      address: v.string.address,
      age: v.number.int,
      hobby: [
        ,
        ,
        v.string.minlen(6)
      ],
      looks: {
        size: {
          foot: v.number.int.between(10,20)
        }
      },
      notes:[,
        {
          log: [
            {
              "local.time": v.string.date
            }
          ]
        },
        {
          log: v.array.len(2).each([
            {
              "local.time": v.string.date
            }
          ])
        }
      ]
    }
    assert(!v.check(data).each(struct).result);
  });

  var d:object = {
    txtusername: "",
    txtpassword: null,
    validcode: ""
  }

  //v.setting.isdev = true;
  
  // it('null test', function () {
  //   assert(v.check(d).each({
  //     txtpassword: v.null
  //   }).result);
  // });

  // it('blank space test', function () {
  //   assert(v.check(d).each({
  //     txtusername: v.string
  //   }).result);
  // });

  // it('prop test', function () {
  //   assert(v.check(d).each({
  //     aaaa: v.null
  //   }).result);
  // });

  it('normal test', function () {
    v.setting.isdev = true;
    assert(!v.check(d).each({
      txtusername: v.string.required,
      txtpassword: v.null
    }).result);
  }); */

}); 