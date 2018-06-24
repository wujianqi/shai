//const Validator = require('../validator.js').default;
const Shai = require('../shai').default;

describe('库环境测试', function () {
  var v = new Shai().validator;
  var m = new Shai().maker;

  //console.dir(Validator['default']);
  // var v = new Validator();

  it('validator test', function () {
    console.log(v.check('23451234','qq'));
  });

  it('maker test', function () {
    console.log(m.get('datetime'));
  });

});