import chai from 'chai';
import Shai from '../lib/shai.js';

chai.expect();
const expect = chai.expect;

describe('validator test', function () {
  var shai = new Shai();

  it('rquire no passed test', () => {
    expect(shai.check('', 'rquire')).to.be.false;
  });
  it('rquire passed test', () => {
    expect(shai.check('dafds', 'rquire')).to.be.true;
  });
  it('english no passed test', () => {
    expect(shai.check('测试', 'english')).to.be.false;
  });
  it('english passed test', () => {
    expect(shai.check('sdafsd', 'english')).to.be.true;
  });
  it('qq no passed test', () => {
    expect(shai.check('11', 'qq')).to.be.false;
  });
  it('qq passed test', () => {
    expect(shai.check('222222', 'qq')).to.be.true;
  });
  it('age no passed test', () => {
    expect(shai.check(150, 'age')).to.be.false;
  });
  it('age passed test', () => {
    expect(shai.check(25, 'age')).to.be.true;
  });
  it('zipcode no passed test', () => {
    expect(shai.check('000000', 'zipcode')).to.be.false;
  });
  it('zipcode passed test', () => {
    expect(shai.check('518000', 'zipcode')).to.be.true;
  });
  it('ip no passed test', () => {
    expect(shai.check('333.12.12.1', 'ip')).to.be.false;
  });
  it('ip passed test', () => {
    expect(shai.check('202.128.1.21', 'ip')).to.be.true;
  });
  it('port no passed test', () => {
    expect(shai.check('88888888', 'port')).to.be.false;
  });
  it('port passed test', () => {
    expect(shai.check('21', 'port')).to.be.true;
  });
  it('bizcode no passed test', () => {
    expect(shai.check('01999999IO9999999', 'bizcode')).to.be.false;
  });
  it('bizcode passed test', () => {
    expect(shai.check('91430111MA4L16JQ9B', 'bizcode')).to.be.true;
  });
  it('invoice no passed test', () => {
    expect(shai.check('9999999999', 'invoice')).to.be.false;
  });
  it('invoice passed test', () => {
    expect(shai.check('1300053140', 'invoice')).to.be.true;
  });
  it('bankcard no passed test', () => {
    expect(shai.check('7066666666666666666', 'bankcard')).to.be.false;
  });
  it('bankcard passed test', () => {
    expect(shai.check('6228480402564890018', 'bankcard')).to.be.true;
  });
  it('currency no passed test', () => {
    expect(shai.check('1111111111.11111', 'currency')).to.be.false;
  });
  it('currency passed test', () => {
    expect(shai.check('111,111.00', 'currency')).to.be.true;
  });
  it('float no passed test', () => {
    expect(shai.check('3sdd', 'float')).to.be.false;
  });
  it('float passed test', () => {
    expect(shai.check('-12.123', 'float')).to.be.true;
  });
  it('int no passed test', () => {
    expect(shai.check('11.11', 'int')).to.be.false;
  });
  it('int passed test', () => {
    expect(shai.check('111', 'int')).to.be.true;
  });
  it('decimal no passed test', () => {
    expect(shai.check('111', 'decimal')).to.be.false;
  });
  it('decimal passed test', () => {
    expect(shai.check('111.11 ', 'decimal')).to.be.true;
  });
  it('chinese no passed test', () => {
    expect(shai.check('ddfa', 'chinese')).to.be.false;
  });
  it('chinese passed test', () => {
    expect(shai.check('中文', 'chinese')).to.be.true;
  });
  it('mail no passed test', () => {
    expect(shai.check('afdsfa.dsaf.com', 'mail')).to.be.false;
  });
  it('mail passed test', () => {
    expect(shai.check('sad.11@164.com', 'mail')).to.be.true;
  });
  it('url no passed test', () => {
    expect(shai.check('dsafsdds', 'url')).to.be.false;
  });
  it('url passed test', () => {
    expect(shai.check('http://sdaf.com', 'url')).to.be.true;
  });
  it('account no passed test', () => {
    expect(shai.check('0111.abc', 'account')).to.be.false;
  });
  it('account passed test', () => {
    expect(shai.check('dasfs223', 'account')).to.be.true;
  });
  it('password no passed test', () => {
    expect(shai.check('1111', 'password')).to.be.false;
  });
  it('password passed test', () => {
    expect(shai.check('qdRdf@121', 'password')).to.be.true;
  });
  it('safe no passed test', () => {
    expect(shai.check('dsafds', 'safe')).to.be.false;
  });
  it('safe passed test', () => {
    expect(shai.check('ds$%`"\'', 'safe')).to.be.true;
  });
  it('dbc no passed test', () => {
    expect(shai.check('fdsa', 'dbc')).to.be.false;
  });
  it('dbc passed test', () => {
    expect(shai.check('ｄｄｄ', 'dbc')).to.be.true;
  });
  it('hex no passed test', () => {
    expect(shai.check('asdfkkl', 'hex')).to.be.false;
  });
  it('hex passed test', () => {
    expect(shai.check('abcedf', 'hex')).to.be.true;
  });
  it('color no passed test', () => {
    expect(shai.check('21p312', 'color')).to.be.false;
  });
  it('color passed test', () => {
    expect(shai.check('#f1dd11', 'color')).to.be.true;
  });
  it('ascii no passed test', () => {
    expect(shai.check('□■', 'ascii')).to.be.false;
  });
  it('ascii passed test', () => {
    expect(shai.check('3E', 'ascii')).to.be.true;
  });
  it('base64 no passed test', () => {
    expect(shai.check('mmmddd1112', 'base64')).to.be.false;
  });
  it('base64 passed test', () => {
    expect(shai.check('dGVzdA==', 'base64')).to.be.true;
  });
  it('md5 no passed test', () => {
    expect(shai.check('dasfhkl11', 'md5')).to.be.false;
  });
  it('md5 passed test', () => {
    expect(shai.check('8d41627e46d5b8556d0d3e30ec15538e', 'md5')).to.be.true;
  });
  it('uuid no passed test', () => {
    expect(shai.check('1312fdsaf', 'uuid')).to.be.false;
  });
  it('uuid passed test', () => {
    expect(shai.check('6c84fb90-12c4-11e1-840d-7b25c5ee775a', 'uuid')).to.be.true;
  });
  it('mobile no passed test', () => {
    expect(shai.check('12121212121', 'mobile')).to.be.false;
  });
  it('mobile passed test', () => {
    expect(shai.check('13700000000', 'mobile')).to.be.true;
  });
  it('telphone no passed test', () => {
    expect(shai.check('aaa', 'telphone')).to.be.false;
  });
  it('telphone passed test', () => {
    expect(shai.check('021-12121111', 'telphone')).to.be.true;
  });
  it('phone no passed test', () => {
    expect(shai.check('213ds', 'phone')).to.be.false;
  });
  it('phone passed test', () => {
    expect(shai.check('13700000000', 'phone')).to.be.true;
  });
  it('percent no passed test', () => {
    expect(shai.check('112', 'percent')).to.be.false;
  });
  it('percent passed test', () => {
    expect(shai.check('12.12%', 'percent')).to.be.true;
  });
  it('year no passed test', () => {
    expect(shai.check('9000', 'year')).to.be.false;
  });
  it('year passed test', () => {
    expect(shai.check('2012', 'year')).to.be.true;
  });
  it('month no passed test', () => {
    expect(shai.check('15', 'month')).to.be.false;
  });
  it('month passed test', () => {
    expect(shai.check('11', 'month')).to.be.true;
  });
  it('day no passed test', () => {
    expect(shai.check('45', 'day')).to.be.false;
  });
  it('day passed test', () => {
    expect(shai.check('23', 'day')).to.be.true;
  });
  it('hour no passed test', () => {
    expect(shai.check('53', 'hour')).to.be.false;
  });
  it('hour passed test', () => {
    expect(shai.check('11', 'hour')).to.be.true;
  });
  it('minute no passed test', () => {
    expect(shai.check('88', 'minute')).to.be.false;
  });
  it('minute passed test', () => {
    expect(shai.check('22', 'minute')).to.be.true;
  });
  it('time no passed test', () => {
    expect(shai.check('23:123:23', 'time')).to.be.false;
  });
  it('time passed test', () => {
    expect(shai.check('12:12:10', 'time')).to.be.true;
  });
  it('date no passed test', () => {
    expect(shai.check('2012-13-23', 'date')).to.be.false;
  });
  it('date passed test', () => {
    expect(shai.check('2012-12-11', 'date')).to.be.true;
  });
  it('datetime no passed test', () => {
    expect(shai.check('2012-16-11 12:18:10', 'datetime')).to.be.false;
  });
  it('datetime passed test', () => {
    expect(shai.check('2012-12-11 12:12:10', 'datetime')).to.be.true;
  });
  it('file no passed test', () => {
    expect(shai.check(' **--.abc', 'file')).to.be.false;
  });
  it('file passed test', () => {
    expect(shai.check('af.cad', 'file')).to.be.true;
  });
  it('image no passed test', () => {
    expect(shai.check('afsd.tt', 'image')).to.be.false;
  });
  it('image passed test', () => {
    expect(shai.check('fasdf.bmp', 'image')).to.be.true;
  });
  it('word no passed test', () => {
    expect(shai.check('asfs.pp', 'word')).to.be.false;
  });
  it('word passed test', () => {
    expect(shai.check('dsafds.doc', 'word')).to.be.true;
  });
  it('lon no passed test', () => {
    expect(shai.check('144', 'lon')).to.be.false;
  });
  it('lon passed test', () => {
    expect(shai.check('113.5986328125', 'lon')).to.be.true;
  });
  it('lat no passed test', () => {
    expect(shai.check('22', 'lat')).to.be.false;
  });
  it('lat passed test', () => {
    expect(shai.check('23.7652368898', 'lat')).to.be.true;
  });
  it('approval no passed test', () => {
    expect(shai.check('abc-1212', 'approval')).to.be.false;
  });
  it('approval passed test', () => {
    expect(shai.check('粤府字〔2004〕18号', 'approval')).to.be.true;
  });
  it('citycode no passed test', () => {
    expect(shai.check('9700324', 'citycode')).to.be.false;
  });
  it('citycode passed test', () => {
    expect(shai.check('440000', 'citycode')).to.be.true;
  });
  it('address no passed test', () => {
    expect(shai.check('随便来点', 'address')).to.be.false;
  });
  it('address passed test', () => {
    expect(shai.check('布吉镇某某街道', 'address')).to.be.true;
  });
  it('upper no passed test', () => {
    expect(shai.check('dafds', 'upper')).to.be.false;
  });
  it('upper passed test', () => {
    expect(shai.check('DDDD ', 'upper')).to.be.true;
  });
  it('lower no passed test', () => {
    expect(shai.check('DDDD', 'lower')).to.be.false;
  });
  it('lower passed test', () => {
    expect(shai.check('dsaf ', 'lower')).to.be.true;
  });
  it('even no passed test', () => {
    expect(shai.check(3, 'even')).to.be.false;
  });
  it('even passed test', () => {
    expect(shai.check(12, 'even')).to.be.true;
  });
  it('odd no passed test', () => {
    expect(shai.check(8, 'odd')).to.be.false;
  });
  it('odd passed test', () => {
    expect(shai.check(33, 'odd')).to.be.true;
  });
  it('ipv6 no passed test', () => {
    expect(shai.check('121:324:23.12', 'ipv6')).to.be.false;
  });
  it('ipv6 passed test', () => {
    expect(shai.check('1050:0000:0000:0000:0005:0600:300c:326b', 'ipv6')).to.be.true;
  });
  it('bodycard no passed test', () => {
    expect(shai.check('291085198403033410', 'bodycard')).to.be.false;
  });
  it('bodycard passed test', () => {
    expect(shai.check('231085198403033418', 'bodycard')).to.be.true;
  });
  it('autocard no passed test', () => {
    expect(shai.check('粤Bi232i', 'autocard')).to.be.false;
  });
  it('autocard passed test', () => {
    expect(shai.check('粤BD00012', 'autocard')).to.be.true;
  });
  it('not no passed test', () => {
    expect(shai.check(12, 'not', '12')).to.be.false;
  });
  it('not passed test', () => {
    expect(shai.check('abc', 'not', 'aaa')).to.be.true;
  });
  it('eq no passed test', () => {
    expect(shai.check('12', 'eq', 13)).to.be.false;
  });
  it('eq passed test', () => {
    expect(shai.check('12', 'eq', 12)).to.be.true;
  });
  it('gt no passed test', () => {
    expect(shai.check('12', 'gt', 13)).to.be.false;
  });
  it('gt passed test', () => {
    expect(shai.check(14, 'gt', 10)).to.be.true;
  });
  it('gte no passed test', () => {
    expect(shai.check(12, 'gte', '13')).to.be.false;
  });
  it('gte passed test', () => {
    expect(shai.check(12, 'gte', '12')).to.be.true;
  });
  it('lt no passed test', () => {
    expect(shai.check('1', 'lt', 0)).to.be.false;
  });
  it('lt passed test', () => {
    expect(shai.check('1', 'lt', 2)).to.be.true;
  });
  it('lte no passed test', () => {
    expect(shai.check('1', 'lte', 0)).to.be.false;
  });
  it('lte passed test', () => {
    expect(shai.check('1', 'lte', 1)).to.be.true;
  });
  it('bet no passed test', () => {
    expect(shai.check('5', 'bet', 2, 5)).to.be.false;
  });
  it('bet passed test', () => {
    expect(shai.check('3', 'bet', 2, 4)).to.be.true;
  });
  it('min no passed test', () => {
    expect(shai.check(2, 'min', 1, 2, 3)).to.be.false;
  });
  it('min passed test', () => {
    expect(shai.check(1, 'min', 1, 2, 3)).to.be.true;
  });
  it('max no passed test', () => {
    expect(shai.check('3', 'max', 1, 2)).to.be.false;
  });
  it('max passed test', () => {
    expect(shai.check('3', 'max', 1, 2, 3)).to.be.true;
  });
  it('len no passed test', () => {
    expect(shai.check('test', 'len', 3)).to.be.false;
  });
  it('len passed test', () => {
    expect(shai.check('test', 'len', 4)).to.be.true;
  });
  it('minl no passed test', () => {
    expect(shai.check('test', 'minl', 6)).to.be.false;
  });
  it('minl passed test', () => {
    expect(shai.check('test', 'minl', 4)).to.be.true;
  });
  it('maxl no passed test', () => {
    expect(shai.check('test', 'maxl', 2)).to.be.false;
  });
  it('maxl passed test', () => {
    expect(shai.check('test', 'maxl', 5)).to.be.true;
  });
  it('in no passed test', () => {
    expect(shai.check('abcd', 'in', 'abc')).to.be.false;
  });
  it('in passed test', () => {
    expect(shai.check('ab', 'in', 'abc')).to.be.true;
  });
  it('json no passed test', () => {
    expect(shai.check('{a:122}', 'json')).to.be.false;
  });
  it('json passed test', () => {
    expect(shai.check('{"a":122}', 'json')).to.be.true;
  });
  it('object no passed test', () => {
    expect(shai.check(111, 'object')).to.be.false;
  });
  it('object passed test', () => {
    expect(shai.check({}, 'object')).to.be.true;
  });
  it('array no passed test', () => {
    expect(shai.check(122, 'array')).to.be.false;
  });
  it('array passed test', () => {
    expect(shai.check([11], 'array')).to.be.true;
  });
  it('string no passed test', () => {
    expect(shai.check(111, 'string')).to.be.false;
  });
  it('string passed test', () => {
    expect(shai.check('dasf', 'string')).to.be.true;
  });
  it('number no passed test', () => {
    expect(shai.check('12', 'number')).to.be.false;
  });
  it('number passed test', () => {
    expect(shai.check(123, 'number')).to.be.true;
  });
  it('boolean no passed test', () => {
    expect(shai.check('0', 'boolean')).to.be.false;
  });
  it('boolean passed test', () => {
    expect(shai.check(true, 'boolean')).to.be.true;
  });
  it('empty no passed test', () => {
    expect(shai.check('dd', 'empty')).to.be.false;
  });
  it('empty passed test', () => {
    expect(shai.check(' ', 'empty')).to.be.true;
  });
});
