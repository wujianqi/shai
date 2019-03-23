import 'mocha';
import assert from 'power-assert';
import shai from '../src/index';

/* describe('数据验证测试 shai valid', function () {
  var v = new shai.Validator();

  it('regexp_rule 正则', function () {
    assert(v.check('23451234','qq'));
  });

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
      format: v.type.age.int.lt(20),
      callback: function(faults: string[]){
        console.log(faults);
      }
    }));
  });

  it('checkJSON 数据验证', function () {
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
          "content": "fdafsd22",
          "log": [{
            "local.time": "2016-15-06"
          }]
        }
      ]
    }`;

    var struct = {
      name: v.type.chinese,
      address: v.type.address ,
      age: v.type.int,
      hobby: v.type.string,
      looks: {
        size: {
          foot: v.type.int.eq(20)
        }
      },
      notes: [
        { 
          log: [
            {
              'local.time': v.type.date
            }
          ]
        }
      ]
    };
    
    assert(!v.checkJSON(json, struct));

  });

}); */


describe('数据生成测试 shai maker', function () {
  var m = new shai.Maker({divisionCode: '440300'});
  var m2 = new shai.Maker({divisionCode: '440200'});

  it('maker 数据生成', function() {
     var jsontpl = m.make(`{
      "name": "<% cnName %>",
      "realname": "<% cnFemaleName %>",
      "region":"<% county%>",
      "address": "<% address %>",
      "list": {
          "datetime":"<% datetime %>",
          "color":"<% color%>",
          "int": "<% increment %>",
          "condition": "<% enum,开始,启用,停止 %>",
          "price": "<% price,1000,100000,true %>",
          "gps":{
              "lon":"<% lon %>",
              "lat":"<% lat %>
          }
        }
      }`);

      var tpl1 = m2.make({
          data:{
            makerOption:[1,2,"abc"],
            items: {
              makerOption:[2],
              a: "<% datetime %>",
              b: "<% int, 2, 10 %>"
            }
          }
        }); 

      /* m2.addRule('testv', () => {
        return 'aaa';
      });

      var tpl2 = m2.make({
          pase: "<% custom, testv%>"
      }); */
      

      console.log(jsontpl);
      console.dir(tpl1);
      //console.dir(tpl2);
  });

});
