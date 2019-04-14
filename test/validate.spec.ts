import 'mocha';
import assert from 'power-assert';
import Validator from '../src/validator/';

describe('单项数据，各规则方法测试 validator test', function () {
  var v = new Validator();

 it('require no passed test', function () {
    assert(!v.check('').require.result);
  });
  it('require passed test', function () {
    assert(v.check('dafds').require.result);
  });
  it('english no passed test', function () {
    assert(!v.check('测试').english.result);
  });
  it('english passed test', function () {
    assert(v.check('sdafsd').english.result);
  });
  it('qq no passed test', function () {
    assert(!v.check('11').qq.result);
  });
  it('qq passed test', function () {
    assert(v.check('222222').qq.result);
  });
  it('age no passed test', function () {
    assert(!v.check(150).age.result);
  });
  it('age passed test', function () {
    assert(v.check(25).age.result);
  });
  it('zipcode no passed test', function () {
    assert(!v.check('000000').zipcode.result);
  });
  it('zipcode passed test', function () {
    assert(v.check('518000').zipcode.result);
  });
  it('ip no passed test', function () {
    assert(!v.check('333.12.12.1').ip.result);
  });
  it('ip passed test', function () {
    assert(v.check('202.128.1.21').ip.result);
  });
  it('port no passed test', function () {
    assert(!v.check('88888888').port.result);
  });
  it('port passed test', function () {
    assert(v.check('21').port.result);
  });
  it('bizcode no passed test', function () {
    assert(!v.check('01999999IO9999999').bizcode.result);
  });
  it('bizcode passed test', function () {
    assert(v.check('91430111MA4L16JQ9B').bizcode.result);
  });
  it('invoice no passed test', function () {
    assert(!v.check('9999999999').invoice.result);
  });
  it('invoice passed test', function () {
    assert(v.check('1300053140').invoice.result);
  });
  it('bankcard no passed test', function () {
    assert(!v.check('7066666666666666666').bankcard.result);
  });
  it('bankcard passed test', function () {
    assert(v.check('6228480402564890018').bankcard.result);
  });
  it('currency no passed test', function () {
    assert(!v.check('1111111111.11111').currency.result);
  });
  it('currency passed test', function () {
    assert(v.check('111,111.00').currency.result);
  });
  it('float no passed test', function () {
    assert(!v.check('3sdd').float.result);
  });
  it('float passed test', function () {
    assert(v.check('-12.123').float.result);
  });
  it('int no passed test', function () {
    assert(!v.check('11.11').int.result);
  });
  it('int passed test', function () {
    assert(v.check('111').int.result);
  });
  it('decimal no passed test', function () {
    assert(!v.check('111').decimal.result);
  });
  it('decimal passed test', function () {
    assert(v.check('111.11').decimal.result);
  });
  it('chinese no passed test', function () {
    assert(!v.check('ddfa').chinese.result);
  });
  it('chinese passed test', function () {
    assert(v.check('中文').chinese.result);
  });
  it('mail no passed test', function () {
    assert(!v.check('afdsfa.dsaf.com').mail.result);
  });
  it('mail passed test', function () {
    assert(v.check('sad.11@164.com').mail.result);
  });
  it('url no passed test', function () {
    assert(!v.check('dsafsdds').url.result);
  });
  it('url passed test', function () {
    assert(v.check('http://sdaf.com').url.result);
  });
  it('account no passed test', function () {
    assert(!v.check('0111.abc').account.result);
  });
  it('account passed test', function () {
    assert(v.check('dasfs223').account.result);
  });
  it('password no passed test', function () {
    assert(!v.check('1111').password.result);
  });
  it('password passed test', function () {
    assert(v.check('qdRdf@121').password.result);
  });
  it('safe no passed test', function () {
    assert(!v.check('$^&*;\/~\|').safe.result);
  });
  it('safe passed test', function () {
    assert(v.check('dsafds').safe.result);
  });
  it('dbc passed test', function () {
    assert(v.check('fdsa').nodbc.result);
  });
  it('dbc no passed test', function () {
    assert(!v.check('ｄｄｄ').nodbc.result);
  });
  it('hex no passed test', function () {
    assert(!v.check('asdfkkl').hex.result);
  });
  it('hex passed test', function () {
    assert(v.check('abcedf').hex.result);
  });
  it('color no passed test', function () {
    assert(!v.check('21p312').color.result);
  });
  it('color passed test', function () {
    assert(v.check('#f1dd11').color.result);
  });
  it('ascii no passed test', function () {
    assert(!v.check('□■').ascii.result);
  });
  it('ascii passed test', function () {
    assert(v.check('3E').ascii.result);
  });
  it('base64 no passed test', function () {
    assert(!v.check('mmmddd1112').base64.result);
  });
  it('base64 passed test', function () {
    assert(v.check('YWZkc2Zkc2FmZHNkZHNhJTIwZmFkc2YzMjQ5MzI0b2hkc2Foa2ZoJTYwMTMxMw==').base64.result);
  });
  it('md5 no passed test', function () {
    assert(!v.check('dasfhkl11').md5.result);
  });
  it('md5 passed test', function () {
    assert(v.check('8d41627e46d5b8556d0d3e30ec15538e').md5.result);
  });
  it('uuid no passed test', function () {
    assert(!v.check('1312fdsaf').uuid.result);
  });
  it('uuid passed test', function () {
    assert(v.check('6c84fb90-12c4-11e1-840d-7b25c5ee775a').uuid.result);
  });
  it('mobile no passed test', function () {
    assert(!v.check('12121212121').mobile.result);
  });
  it('mobile passed test', function () {
    assert(v.check('13700000000').mobile.result);
  });
  it('telphone no passed test', function () {
    assert(!v.check('aaa').telphone.result);
  });
  it('telphone passed test', function () {
    assert(v.check('021-12121111').telphone.result);
  });
  it('phone no passed test', function () {
    assert(!v.check('213ds').phone.result);
  });
  it('phone passed test', function () {
    assert(v.check('13700000000').phone.result);
  });
  it('percent no passed test', function () {
    assert(!v.check('112').percent.result);
  });
  it('percent passed test', function () {
    assert(v.check('12.12%').percent.result);
  });
  it('year no passed test', function () {
    assert(!v.check('9000').year.result);
  });
  it('year passed test', function () {
    assert(v.check('2012').year.result);
  });
  it('month no passed test', function () {
    assert(!v.check('15').month.result);
  });
  it('month passed test', function () {
    assert(v.check('11').month.result);
  });
  it('day no passed test', function () {
    assert(!v.check('45').day.result);
  });
  it('day passed test', function () {
    assert(v.check('23').day.result);
  });
  it('hour no passed test', function () {
    assert(!v.check('53').hour.result);
  });
  it('hour passed test', function () {
    assert(v.check('11').hour.result);
  });
  it('minute no passed test', function () {
    assert(!v.check('88').minute.result);
  });
  it('minute passed test', function () {
    assert(v.check('22').minute.result);
  });
  it('time no passed test', function () {
    assert(!v.check('23:123:23').time.result);
  });
  it('time passed test', function () {
    assert(v.check('12:12:10').time.result);
  });
  it('date no passed test', function () {
    assert(!v.check('2012-13-23').date.result);
  });
  it('date passed test', function () {
    assert(v.check('2012-12-11').date.result);
  });
  it('datetime no passed test', function () {
    assert(!v.check('2012-16-11 12:18:10').datetime.result);
  });
  it('datetime passed test', function () {
    assert(v.check('2012-12-11 12:12:10').datetime.result);
  });
  it('file no passed test', function () {
    assert(!v.check(' **--.abc').file.result);
  });
  it('file passed test', function () {
    assert(v.check('af.cad').file.result);
  });
  it('image no passed test', function () {
    assert(!v.check('afsd.tt').image.result);
  });
  it('image passed test', function () {
    assert(v.check('fasdf.bmp').image.result);
  });
  it('word no passed test', function () {
    assert(!v.check('asfs.pp').word.result);
  });
  it('word passed test', function () {
    assert(v.check('dsafds.doc').word.result);
  });
  it('lon no passed test', function () {
    assert(!v.check('144').lon.result);
  });
  it('lon passed test', function () {
    assert(v.check('113.5986328125').lon.result);
  });
  it('lat no passed test', function () {
    assert(!v.check('22').lat.result);
  });
  it('lat passed test', function () {
    assert(v.check('23.7652368898').lat.result);
  });
  it('approval no passed test', function () {
    assert(!v.check('abc-1212').approval.result);
  });
  it('approval passed test', function () {
    assert(v.check('粤府字〔2004〕18号').approval.result);
  });
  it('approval +第 passed test', function () {
    assert(v.check('粤府字〔2004〕第18号').approval.result);
  });
  it('approval [] passed test', function () {
    assert(v.check('政字[2004]18号').approval.result);
  });
  it('citycode no passed test', function () {
    assert(!v.check('9700324').citycode.result);
  });
  it('citycode passed test', function () {
    assert(v.check('440000').citycode.result);
  });
  it('address no passed test', function () {
    assert(!v.check('随便来点').address.result);
  });
  it('address passed test', function () {
    assert(v.check('布吉镇某某街道').address.result);
  });
  it('upper no passed test', function () {
    assert(!v.check('dafds').upper.result);
  });
  it('upper passed test', function () {
    assert(v.check('DDDD ').upper.result);
  });
  it('lower no passed test', function () {
    assert(!v.check('DDDD').lower.result);
  });
  it('lower passed test', function () {
    assert(v.check('dsaf ').lower.result);
  });
  it('even no passed test', function () {
    assert(!v.check(3).even.result);
  });
  it('even passed test', function () {
    assert(v.check(12).even.result);
  });
  it('odd no passed test', function () {
    assert(!v.check(8).odd.result);
  });
  it('odd passed test', function () {
    assert(v.check(33).odd.result);
  });
  it('ipv6 no passed test', function () {
    assert(!v.check('121:324:23.12').ipv6.result);
  });
  it('ipv6 passed test', function () {
    assert(v.check('1050:0000:0000:0000:0005:0600:300c:326b').ipv6.result);
  });
  it('bodycard no passed test', function () {
    assert(!v.check('291085198403033410').bodycard.result);
  });
  it('bodycard passed test', function () {
    assert(v.check('231085198403033418').bodycard.result);
  });
  it('autocard no passed test', function () {
    assert(!v.check('粤Bi232i').autocard.result);
  });
  it('autocard passed test', function () {
    assert(v.check('粤BD00012').autocard.result);
  });
  it('not passed test', function () {
    assert(!v.check(12).not('12').result);
  });
  it('not passed test', function () {
    assert(v.check('abc').not('aaa').result);
  });
  it('eq no passed test', function () {
    assert(!v.check('12').eq(13).result);
  });
  it('eq passed test', function () {
    assert(v.check(12).eq(12).result);
  });
  it('gt no passed test', function () {
    assert(!v.check('12').gt(13).result);
  });
  it('gt passed test', function () {
    assert(v.check(14).gt(10).result);
  });
  it('gte no passed test', function () {
    assert(!v.check(12).gte(13).result);
  });
  it('gte passed test', function () {
    assert(v.check(12).gte(12).result);
  });
  it('lt no passed test', function () {
    assert(!v.check('1').lt(0).result);
  });
  it('lt passed test', function () {
    assert(v.check('1').lt(2).result);
  });
  it('lte no passed test', function () {
    assert(!v.check('1').lte(0).result);
  });
  it('lte passed test', function () {
    assert(v.check('1').lte(1).result);
  });
  it('between no passed test', function () {
    assert(!v.check('5').between(2, 5).result);
  });
  it('between passed test', function () {
    assert(v.check('3').between(2, 4).result);
    assert(v.check(new Date('2012/02/12')).between(new Date('2010/02/12'), new Date('2019/02/12')).result);
  });
  it('min no passed test', function () {
    assert(!v.check(2).min(1, 2, 3).result);
  });
  it('min passed test', function () {
    assert(v.check(1).min(1, 2, 3).result);
  });
  it('max no passed test', function () {
    assert(!v.check('3').max(1, 2).result);
  });
  it('max passed test', function () {
    assert(v.check('3').max(1, 2, 3).result);
  });
  it('length no passed test', function () {
    assert(!v.check('test').length(3).result);
  });
  it('length passed test', function () {
    assert(v.check('test').length(4).result);
  });
  it('minlength no passed test', function () {
    assert(!v.check('test').minlength(6).result);
  });
  it('minlength passed test', function () {
    assert(v.check('test').minlength(4).result);
    assert(v.check('test').minlength(3).result);
  });
  it('maxlength no passed test', function () {
    assert(!v.check('test').maxlength(3).result);
  });
  it('maxlength passed test', function () {
    assert(v.check('test').maxlength(6).result);
    assert(v.check('test').maxlength(4).result);
  });
  it('bitmax no passed test', function () {
    assert(!v.check('汉字12').bitmax(4).result);
  });
  it('bitmax passed test', function () {
    assert(v.check('汉字12').bitmax(8).result);
  });
  it('in no passed test', function () {
    assert(!v.check('abcd').in('abc').result);
  });
  it('in passed test', function () {
    assert(v.check('ab').in('abc').result);
    assert(v.check(1).in([1,2,3]));
    assert(v.check('abc').in({'abc': 1}).result);
  });
  it('has test', function () {
    assert(v.check('abcd').has('abc').result);
    assert(v.check([1,2,3]).has(1).result);    
    assert(v.check({'abc': 1}).has('abc').result);
  });
  it('tag test', function () {
    assert(v.check('<dda>dd</dda>').tag.result);
  });  
  it('custom test', function () {
    v.add('testv', (t1:string, t2:string) => {
      return t1.indexOf(t2) > -1
    });
    assert(v.check('aaabbbccc').custom('testv','aaa').result);
    assert(!v.check('aaab').custom('testv').result);

    assert(v.check([1,2,3,4]).custom((str:number[]) => str.length === 4).result);

  });
  it('base test', function () {
    assert(v.check({}).object.result);
    assert(!v.check('aaab').object.result);
    assert(v.check(null).null.result);
    assert(!v.check('').null.result);

  });
});
