import 'mocha';
import shai from '../src/index';

describe('数据生成测试 shai maker', function () {
    var m = new shai.Maker({divisionCode: '440300'});
    var m2 = new shai.Maker({divisionCode: '440200'});
  
    it('maker 数据生成', function() {
        var jsontpl = m.make(`{        
        "realname": "<% cnFemaleName %>",
        "region":"<% county%>",
        "address": "<% address %>",
        "list": {
            "makerOption": [2],
            "datetime":"<% datetime %>",
            "color":"<% color%>",
            "int": "<% increment %>",
            "condition": "<% enum,开始,启用,停止 %>",
            "price": "<% price,1000,100000,true %>",
            "gps":{
                "lon":"<% lon %>",
                "lat":"<% lat %>"
            }
          }
        }`);

         var tpl1 = m2.make({
            data:{
              makerOption:[5],
              name: "<% cnName %>",
              id: "<% uuid, %>",
              b: "<% int, 1, 20 %>",
              "c <% increment %>": "<% increment, false %>   <% english %>",
              items: {
                makerOption:[1, 2, 'childrens'],
                a: "<% datetime %>"
              }
            }
          }); 
  
        m2.add('testv', (a) => {
           return m2.get('increment', false) as number * a;
        });
  
        var tpl2 = m2.make({
            id: "<% increment %>",
            pase: "<% custom, testv, 10 %>",            
            test: ["<% range, 1, 5 %>","<% range, 10, 12, 2 %>"] 
        },'range, add');
  
        console.log(JSON.stringify(jsontpl));
        console.dir(tpl1);
        console.dir(tpl2);
    });
  
  }); 
  