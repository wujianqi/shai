const shai  = require('../lib/shai');
const Schema =  require('async-validator');

describe('async-validator库兼容验证测试', function () {
  var v = shai.validator;
  var source = {
    name: '',
    age: 24
  }
  v.add('testx', (val,val2) => {
    return val > val2;
  }, '%n必须大于%t')

  v.setting.isdev = true;
  var ageRule = v.number.alias('年龄').custom('testx', 30).rule;

  /* var test =  {
    type: 'number',
    required: true,
    min: 5,
    max: 10,
  }; */
 /* var ageRule =  [{
    type:'string',
    required: true,
    message: '11111'
  },{
    validator: (rule, value, callback) => {      
      return new Error("%s must be lowercase alphanumeric characters", rule.field);
    }
  },{
    asyncValidator: (rule, value, cb) => {
      new Promise((resolve,reject) => {
        setTimeout(() => {          
          resolve(value === '');
        }, 1000);
      }) .then(function(data){
        const res = data ? true : new Error('aaaa');
        cb(res);
      });
    }
  }]; */

  var schema = new Schema({
    age: ageRule
  }); 

  //console.dir(ageRule);
  
  schema.validate(source, (errors, fields) => {
    console.log(errors);
  })

})