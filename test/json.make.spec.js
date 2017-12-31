import chai from 'chai';
import Shai from '../lib/shai.js';

chai.expect();
// const expect = chai.expect;

describe('json template make test', function () {
  it('template case', function () {
    var shai = new Shai(), jsontpl, s1, tpl1;

    shai.config = {
      divisionCode: 500235
    };
    jsontpl = shai.make(`{
      "name": "#cnName#",
      "realname": "#cnFemaleName#",
      "region":"#county#",
      "address": "#address#",
      "list": ${shai.make(`{
          "datetime":"#datetime#",
          "color":"#color#",
          "int": #increment#,
          "condition": "#range,开始,启用,停止#",
          "price": "#price,1000,100000,true#",
          "gps":{
              "lon":#lon#,
              "lat":#lat#
          }
        }`, 3)}
      }`);

    s1 = new Shai();
    s1.config = {
      divisionCode: 360000
    };
    tpl1 = s1.make(`{
      "name": "#cnName#",
      "realname": "#cnFemaleName#",
      "region":"#county#",
      "address": "#address#"
      }`, 6);

    console.log(jsontpl, '\n\n', tpl1);
    // expect(JSON.parse(jsontpl)).to.be.an('object');
  });

});

