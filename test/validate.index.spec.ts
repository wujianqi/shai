import 'mocha';
import assert from 'power-assert';
import shai from '../src/index';

describe('数据验证测试 shai valid', function () {
  var v = new shai.Validator();

  it('function_rule 比较1', function () {
    assert(v.check(1,'eq', 1));
  });

  it('function_rule 比较2', function () {
    assert(v.check(1,'not', 2));
  });

  it('check 可选项', function () {
    assert(v.check(1) || !v.check(''));
  });

  it('扩展规则', function () {
    assert(v.check(123,'custom', (arg:any) => arg.toString()=== '123'));
  });

  it('checkItem 链式', function () {
    assert(!v.checkItem({
      value: '23',
      format: v.number.age.int.lt(20),
      callback: function(faults: string[]){
        console.log(faults);
      }
    }));
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
      txtusername: v.string.require,
      txtpassword: v.null
    }));
  });

}); 