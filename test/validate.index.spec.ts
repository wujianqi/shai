import 'mocha';
import assert from 'power-assert';
import shai from '../src/index';

describe('数据验证测试 shai valid', function () {
  var v = new shai.Validator();
  v.isdev = true;

  it('get 方式', function () {
    var json = {
      "name": "张三",
      "age":30,
      "looks":{
        "size": {
          "foot": 41.2
        }
      }
    }

    var chain = v.get(json, 'looks.size.foot').number.int.on('int',res =>{
      if(res) console.log('整数验证通过');
      else  console.log('整数验证没有通过');
    }).on( faults => {
      if (faults.indexOf('int') === -1) console.log('整数验证通过！');
      faults.forEach(f => {
        if (f === 'int') console.log('整数验证没有通过');
      });
    });

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
      name: v.string.chinese,
      address: v.string.address,
      age: v.number.int,
      hobby: v.string,
      looks: {
        size: {
          foot: v.number.int.eq(20)
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