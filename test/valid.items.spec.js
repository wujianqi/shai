import chai from 'chai';
import Shai from '../lib/shai.js';

chai.expect();
const expect = chai.expect;

describe('validator items test', function () {
  var shai = new Shai();

  it('Combinatorial check', () => {
    shai.addRule({
      'test1': (val, n1, n2) => (val.length > n1) && (val.length < n2)
    });

    expect(shai.checkItem(
      {
        value: 'yr qw2{O15',
        eq: 'yr qw2{O',
        password: true,
        test1: [6, 10],
        callback: faults => {
          faults.forEach(f => {
            if (f === 'eq') console.log('二次密码错误');
            if (f === 'test1') console.log('不在值6与10之间');
          });
        }
      }
    )).to.be.false;

    expect(shai.checkItem(
      {
        value: 'yr qw2{O',
        rule: shai.t.eq('yr qw2{O').test1(6, 10),
        callback: faults => {
          if (faults.indexOf('eq') === -1) console.log('密码二次验证OK！');
          faults.forEach(f => {
            if (f === 'eq') console.log('二次密码错误');
            if (f === 'test1') console.log('不在值6与10之间');
          });
        }
      }
    )).to.be.true;

  });

});

