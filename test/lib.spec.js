const valid = require('../lib/validator');
const maker = require('../lib/maker');
const shai = require('../lib/shai');

describe('Validator库测试', function () {
  it('validator test', function () {
    console.log(valid.check('23451234').qq.result);
  });

});
describe('Maker库测试', function () {
  it('maker test', function () {
    console.log(maker.get('address'));
  });

});

describe('完整库测试', function () {
  var v = shai.validator;
  var m = shai.maker;

  it('validator test', function () {
    console.log(v.check('23451234aaa').qq.result);
  });

  it('maker test', function () {
    console.log(m.get('datetime'));
  });

});