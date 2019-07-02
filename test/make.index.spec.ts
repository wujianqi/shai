import 'mocha';
import shai from '../src/index';

describe('数据生成测试 shai maker', function () {
    var m = shai.maker;
    //m.setting.divisionCode = '440300';
    m.add('sope', ():string => {
      m.setting.incrementBase = 0;
      return '';
    })
  
    it('maker 数据生成', function() {
        m.setting.divisionCode = '440300';
        var tpl1 = m.make({
          data:{
            makerOption:[10],
            name: "<% cnName %>",
            id: "<% uuid, %>",
            b: "<% int, 1, 20 %>",
            "c <% increment %>": "<% increment, false %>   <% english %>",
            items: {
              makerOption:[2, 3, 'childrens'],
              a: "<% datetime %>"
            }
          }
        });
  
        m.setting.incrementBase = 0;
        m.add('testv', (a) => {
           return m.get('increment', false) as number * a;
        });
  
        var tpl2 = m.make({
          id: '<% increment %>',
          pase: '<% custom, testv, 10 %>',
          test: ['<% range, 1, 5 %>','<% range, 10, 12, 2 %>'] 
        },'range');
  
        console.log(tpl1);
        console.dir(tpl2);
    });
  
  });

  describe('数据生成测试，异步 shai maker', function () {
    it("test",function(done){
      this.timeout(6000);
      var m = shai.maker;
      m.setting.divisionCode = '440300';

      new Promise((resolve, reject) => {
        let data = {
          "makerOption": [50],
          "realname": "<% cnFemaleName %>",
          "region":"<% province%>",
          "prefecture":"<% prefecture%>",
          "region1":"<% county%>",
          "address": "<% address %>",
          "list": {
              "makerOption": [2, 2, "test"],
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
          };
        resolve(m.make(data));
      }).then(data => {
        try{
        　console.log(data);
        　done();
        }catch(err){
          done(err);
        }
      });
    });
  
  });