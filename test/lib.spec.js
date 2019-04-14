const Validator = require('../lib/validator');
const Maker = require('../lib/maker');
const shai = require('../lib/shai');

describe('Validator库测试', function () {
  it('validator test', function () {
    console.log((new Validator()).check('23451234').qq.result);
  });

});

describe('Maker库测试', function () {
  var m = new Maker();

  it('maker test', function () {
    console.log(m.get('address'));
  });

});

describe('完整库测试', function () {
  var v = new shai.Validator();
  var m = new shai.Maker();

  it('validator test', function () {
    console.log(v.check('23451234aaa').qq.result);
  });

  it('maker test', function () {
    console.log(m.get('datetime'));
  });

});