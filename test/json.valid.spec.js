import chai from 'chai';
import Shai from '../lib/shai.js';

chai.expect();

describe('json valid test', function () {

  it('test case', function () {
    var s = new Shai();

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
      name: s.t.chinese,
      address: s.t.string,
      age: s.t.int.eq(30),
      looks: {
        size: {
          foot: s.t.int
        }
      },
      hobby: s.t.array,
      notes: [
        { content: s.t.number,
          log: [
            {
              'local.time': s.t.date
            }
          ]
        }
      ]
    };

    console.log(s.checkData(struct, json));

  });

});

