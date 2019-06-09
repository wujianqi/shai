import 'mocha';
import shai from '../src/index';

describe('数据生成测试 shai maker', function () {
    var m = shai.maker;
    m.setting.divisionCode = '440300';    
  
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

        m.setting.divisionCode = '440200';
        var tpl1 = m.make({
          data:{
            makerOption:[10000],
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
  
        m.add('testv', (a) => {
           return m.get('increment', false) as number * a;
        });
  
        var tpl2 = m.make({
          id: '<% increment %>',
          pase: '<% custom, testv, 10 %>',
          test: ['<% range, 1, 5 %>','<% range, 10, 12, 2 %>'] 
        },'range');
  
        console.log(jsontpl);
        console.log(tpl1);
        console.dir(tpl2);
    });
  
  }); 
  