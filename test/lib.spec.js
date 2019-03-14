const Validator = require('../validator.js').default;
const Maker = require('../maker.js').default;
const Shai = require('../shai').default;

describe('Validator库测试', function () {
  //console.dir(Validator);

  it('validator test', function () {
    console.log((new Validator()).check('23451234','qq'));
  });

});

describe('Maker库测试', function () {
  //console.dir(Maker['default']);
  var m = new Maker();

  it('maker test', function () {
    console.log(m.get('address'));
  });

});

describe('完整库测试', function () {
  var v = new Shai().validator;
  var m = new Shai().maker;

  it('validator test', function () {
    console.log(v.check('23451234aaa','qq'));
  });

  it('maker test', function () {
    console.log(m.get('datetime'));
  });

});