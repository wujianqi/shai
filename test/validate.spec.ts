import 'mocha';
import assert from 'power-assert';
import Shai from '../src/index';

describe('单项数据，各规则方法测试 validator test', function () {
  var v = new Shai().validator;

  it('require no passed test', function () {
    assert(!v.check('', 'require'));
  });
  it('require passed test', function () {
    assert(v.check('dafds', 'require'));
  });
  it('english no passed test', function () {
    assert(!v.check('测试', 'english'));
  });
  it('english passed test', function () {
    assert(v.check('sdafsd', 'english'));
  });
  it('qq no passed test', function () {
    assert(!v.check('11', 'qq'));
  });
  it('qq passed test', function () {
    assert(v.check('222222', 'qq'));
  });
  it('age no passed test', function () {
    assert(!v.check(150, 'age'));
  });
  it('age passed test', function () {
    assert(v.check(25, 'age'));
  });
  it('zipcode no passed test', function () {
    assert(!v.check('000000', 'zipcode'));
  });
  it('zipcode passed test', function () {
    assert(v.check('518000', 'zipcode'));
  });
  it('ip no passed test', function () {
    assert(!v.check('333.12.12.1', 'ip'));
  });
  it('ip passed test', function () {
    assert(v.check('202.128.1.21', 'ip'));
  });
  it('port no passed test', function () {
    assert(!v.check('88888888', 'port'));
  });
  it('port passed test', function () {
    assert(v.check('21', 'port'));
  });
  it('bizcode no passed test', function () {
    assert(!v.check('01999999IO9999999', 'bizcode'));
  });
  it('bizcode passed test', function () {
    assert(v.check('91430111MA4L16JQ9B', 'bizcode'));
  });
  it('invoice no passed test', function () {
    assert(!v.check('9999999999', 'invoice'));
  });
  it('invoice passed test', function () {
    assert(v.check('1300053140', 'invoice'));
  });
  it('bankcard no passed test', function () {
    assert(!v.check('7066666666666666666', 'bankcard'));
  });
  it('bankcard passed test', function () {
    assert(v.check('6228480402564890018', 'bankcard'));
  });
  it('currency no passed test', function () {
    assert(!v.check('1111111111.11111', 'currency'));
  });
  it('currency passed test', function () {
    assert(v.check('111,111.00', 'currency'));
  });
  it('float no passed test', function () {
    assert(!v.check('3sdd', 'float'));
  });
  it('float passed test', function () {
    assert(v.check('-12.123', 'float'));
  });
  it('int no passed test', function () {
    assert(!v.check('11.11', 'int'));
  });
  it('int passed test', function () {
    assert(v.check('111', 'int'));
  });
  it('decimal no passed test', function () {
    assert(!v.check('111', 'decimal'));
  });
  it('decimal passed test', function () {
    assert(v.check('111.11 ', 'decimal'));
  });
  it('chinese no passed test', function () {
    assert(!v.check('ddfa', 'chinese'));
  });
  it('chinese passed test', function () {
    assert(v.check('中文', 'chinese'));
  });
  it('mail no passed test', function () {
    assert(!v.check('afdsfa.dsaf.com', 'mail'));
  });
  it('mail passed test', function () {
    assert(v.check('sad.11@164.com', 'mail'));
  });
  it('url no passed test', function () {
    assert(!v.check('dsafsdds', 'url'));
  });
  it('url passed test', function () {
    assert(v.check('http://sdaf.com', 'url'));
  });
  it('account no passed test', function () {
    assert(!v.check('0111.abc', 'account'));
  });
  it('account passed test', function () {
    assert(v.check('dasfs223', 'account'));
  });
  it('password no passed test', function () {
    assert(!v.check('1111', 'password'));
  });
  it('password passed test', function () {
    assert(v.check('qdRdf@121', 'password'));
  });
  it('safe no passed test', function () {
    assert(!v.check('dsafds', 'safe'));
  });
  it('safe passed test', function () {
    assert(v.check('ds$%`"\'', 'safe'));
  });
  it('dbc no passed test', function () {
    assert(!v.check('fdsa', 'dbc'));
  });
  it('dbc passed test', function () {
    assert(v.check('ｄｄｄ', 'dbc'));
  });
  it('hex no passed test', function () {
    assert(!v.check('asdfkkl', 'hex'));
  });
  it('hex passed test', function () {
    assert(v.check('abcedf', 'hex'));
  });
  it('color no passed test', function () {
    assert(!v.check('21p312', 'color'));
  });
  it('color passed test', function () {
    assert(v.check('#f1dd11', 'color'));
  });
  it('ascii no passed test', function () {
    assert(!v.check('□■', 'ascii'));
  });
  it('ascii passed test', function () {
    assert(v.check('3E', 'ascii'));
  });
  it('base64 no passed test', function () {
    assert(!v.check('mmmddd1112', 'base64'));
  });
  it('base64 passed test', function () {
    assert(v.check('YWZkc2Zkc2FmZHNkZHNhJTIwZmFkc2YzMjQ5MzI0b2hkc2Foa2ZoJTYwMTMxMw==', 'base64'));
  });
  it('md5 no passed test', function () {
    assert(!v.check('dasfhkl11', 'md5'));
  });
  it('md5 passed test', function () {
    assert(v.check('8d41627e46d5b8556d0d3e30ec15538e', 'md5'));
  });
  it('uuid no passed test', function () {
    assert(!v.check('1312fdsaf', 'uuid'));
  });
  it('uuid passed test', function () {
    assert(v.check('6c84fb90-12c4-11e1-840d-7b25c5ee775a', 'uuid'));
  });
  it('mobile no passed test', function () {
    assert(!v.check('12121212121', 'mobile'));
  });
  it('mobile passed test', function () {
    assert(v.check('13700000000', 'mobile'));
  });
  it('telphone no passed test', function () {
    assert(!v.check('aaa', 'telphone'));
  });
  it('telphone passed test', function () {
    assert(v.check('021-12121111', 'telphone'));
  });
  it('phone no passed test', function () {
    assert(!v.check('213ds', 'phone'));
  });
  it('phone passed test', function () {
    assert(v.check('13700000000', 'phone'));
  });
  it('percent no passed test', function () {
    assert(!v.check('112', 'percent'));
  });
  it('percent passed test', function () {
    assert(v.check('12.12%', 'percent'));
  });
  it('year no passed test', function () {
    assert(!v.check('9000', 'year'));
  });
  it('year passed test', function () {
    assert(v.check('2012', 'year'));
  });
  it('month no passed test', function () {
    assert(!v.check('15', 'month'));
  });
  it('month passed test', function () {
    assert(v.check('11', 'month'));
  });
  it('day no passed test', function () {
    assert(!v.check('45', 'day'));
  });
  it('day passed test', function () {
    assert(v.check('23', 'day'));
  });
  it('hour no passed test', function () {
    assert(!v.check('53', 'hour'));
  });
  it('hour passed test', function () {
    assert(v.check('11', 'hour'));
  });
  it('minute no passed test', function () {
    assert(!v.check('88', 'minute'));
  });
  it('minute passed test', function () {
    assert(v.check('22', 'minute'));
  });
  it('time no passed test', function () {
    assert(!v.check('23:123:23', 'time'));
  });
  it('time passed test', function () {
    assert(v.check('12:12:10', 'time'));
  });
  it('date no passed test', function () {
    assert(!v.check('2012-13-23', 'date'));
  });
  it('date passed test', function () {
    assert(v.check('2012-12-11', 'date'));
  });
  it('datetime no passed test', function () {
    assert(!v.check('2012-16-11 12:18:10', 'datetime'));
  });
  it('datetime passed test', function () {
    assert(v.check('2012-12-11 12:12:10', 'datetime'));
  });
  it('file no passed test', function () {
    assert(!v.check(' **--.abc', 'file'));
  });
  it('file passed test', function () {
    assert(v.check('af.cad', 'file'));
  });
  it('image no passed test', function () {
    assert(!v.check('afsd.tt', 'image'));
  });
  it('image passed test', function () {
    assert(v.check('fasdf.bmp', 'image'));
  });
  it('word no passed test', function () {
    assert(!v.check('asfs.pp', 'word'));
  });
  it('word passed test', function () {
    assert(v.check('dsafds.doc', 'word'));
  });
  it('lon no passed test', function () {
    assert(!v.check('144', 'lon'));
  });
  it('lon passed test', function () {
    assert(v.check('113.5986328125', 'lon'));
  });
  it('lat no passed test', function () {
    assert(!v.check('22', 'lat'));
  });
  it('lat passed test', function () {
    assert(v.check('23.7652368898', 'lat'));
  });
  it('approval no passed test', function () {
    assert(!v.check('abc-1212', 'approval'));
  });
  it('approval passed test', function () {
    assert(v.check('粤府字〔2004〕18号', 'approval'));
  });
  it('approval +第 passed test', function () {
    assert(v.check('粤府字〔2004〕第18号', 'approval'));
  });
  it('approval [] passed test', function () {
    assert(v.check('政字[2004]18号', 'approval'));
  });
  it('citycode no passed test', function () {
    assert(!v.check('9700324', 'citycode'));
  });
  it('citycode passed test', function () {
    assert(v.check('440000', 'citycode'));
  });
  it('address no passed test', function () {
    assert(!v.check('随便来点', 'address'));
  });
  it('address passed test', function () {
    assert(v.check('布吉镇某某街道', 'address'));
  });
  it('upper no passed test', function () {
    assert(!v.check('dafds', 'upper'));
  });
  it('upper passed test', function () {
    assert(v.check('DDDD ', 'upper'));
  });
  it('lower no passed test', function () {
    assert(!v.check('DDDD', 'lower'));
  });
  it('lower passed test', function () {
    assert(v.check('dsaf ', 'lower'));
  });
  it('even no passed test', function () {
    assert(!v.check(3, 'even'));
  });
  it('even passed test', function () {
    assert(v.check(12, 'even'));
  });
  it('odd no passed test', function () {
    assert(!v.check(8, 'odd'));
  });
  it('odd passed test', function () {
    assert(v.check(33, 'odd'));
  });
  it('ipv6 no passed test', function () {
    assert(!v.check('121:324:23.12', 'ipv6'));
  });
  it('ipv6 passed test', function () {
    assert(v.check('1050:0000:0000:0000:0005:0600:300c:326b', 'ipv6'));
  });
  it('bodycard no passed test', function () {
    assert(!v.check('291085198403033410', 'bodycard'));
  });
  it('bodycard passed test', function () {
    assert(v.check('231085198403033418', 'bodycard'));
  });
  it('autocard no passed test', function () {
    assert(!v.check('粤Bi232i', 'autocard'));
  });
  it('autocard passed test', function () {
    assert(v.check('粤BD00012', 'autocard'));
  });
  it('not no passed test', function () {
    assert(!v.check(12, 'not', '12'));
  });
  it('not passed test', function () {
    assert(v.check('abc', 'not', 'aaa'));
  });
  it('eq no passed test', function () {
    assert(!v.check('12', 'eq', 13));
  });
  it('eq passed test', function () {
    assert(v.check('12', 'eq', 12));
  });
  it('gt no passed test', function () {
    assert(!v.check('12', 'gt', 13));
  });
  it('gt passed test', function () {
    assert(v.check(14, 'gt', 10));
  });
  it('gte no passed test', function () {
    assert(!v.check(12, 'gte', '13'));
  });
  it('gte passed test', function () {
    assert(v.check(12, 'gte', '12'));
  });
  it('lt no passed test', function () {
    assert(!v.check('1', 'lt', 0));
  });
  it('lt passed test', function () {
    assert(v.check('1', 'lt', 2));
  });
  it('lte no passed test', function () {
    assert(!v.check('1', 'lte', 0));
  });
  it('lte passed test', function () {
    assert(v.check('1', 'lte', 1));
  });
  it('between no passed test', function () {
    assert(!v.check('5', 'between', 2, 5));
  });
  it('between passed test', function () {
    assert(v.check('3', 'between', 2, 4));
  });
  it('min no passed test', function () {
    assert(!v.check(2, 'min', 1, 2, 3));
  });
  it('min passed test', function () {
    assert(v.check(1, 'min', 1, 2, 3));
  });
  it('max no passed test', function () {
    assert(!v.check('3', 'max', 1, 2));
  });
  it('max passed test', function () {
    assert(v.check('3', 'max', 1, 2, 3));
  });
  it('length no passed test', function () {
    assert(!v.check('test', 'length', 3));
  });
  it('length passed test', function () {
    assert(v.check('test', 'length', 4));
  });
  it('minlength no passed test', function () {
    assert(!v.check('test', 'minlength', 4));
  });
  it('minlength passed test', function () {
    assert(v.check('test', 'minlength', 6));
  });
  it('maxlength no passed test', function () {
    assert(!v.check('test', 'maxlength', 5));
  });
  it('maxlength passed test', function () {
    assert(v.check('test', 'maxlength', 2));
  });
  it('in no passed test', function () {
    assert(!v.check('abcd', 'in', 'abc'));
  });
  it('in passed test', function () {
    assert(v.check('ab', 'in', 'abc'));
  });
});
