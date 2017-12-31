import chai from 'chai';
import Shai from '../lib/shai.js';

chai.expect();
const expect = chai.expect;

describe('make test', function () {
  var shai = new Shai();

  it('exp make test', () => {
    console.log(shai.schema('exp'));
    expect(shai.schema('exp')).to.be.a('string');
  });
  it('range make test', () => {
    console.log(shai.schema('range'));
    expect(shai.schema('range')).to.be.a('string');
  });
  it('int make test', () => {
    console.log(shai.schema('int'));
    expect(shai.schema('int')).to.be.a('number');
  });
  it('number make test', () => {
    console.log(shai.schema('number'));
    expect(shai.schema('number')).to.be.a('number');
  });
  it('bool make test', () => {
    console.log(shai.schema('bool'));
    expect(shai.schema('bool')).to.be.a('boolean');
  });
  it('datetime make test', () => {
    console.log(shai.schema('datetime'));
    expect(shai.schema('datetime')).to.be.a('string');
  });
  it('date make test', () => {
    console.log(shai.schema('date'));
    expect(shai.schema('date')).to.be.a('string');
  });
  it('time make test', () => {
    console.log(shai.schema('time'));
    expect(shai.schema('time')).to.be.a('string');
  });
  it('year make test', () => {
    console.log(shai.schema('year'));
    expect(shai.schema('year')).to.be.a('number');
  });
  it('month make test', () => {
    console.log(shai.schema('month'));
    expect(shai.schema('month')).to.be.a('number');
  });
  it('day make test', () => {
    console.log(shai.schema('day'));
    expect(shai.schema('day')).to.be.a('number');
  });
  it('hour make test', () => {
    console.log(shai.schema('hour'));
    expect(shai.schema('hour')).to.be.a('number');
  });
  it('minute make test', () => {
    console.log(shai.schema('minute'));
    expect(shai.schema('minute')).to.be.a('number');
  });
  it('now make test', () => {
    console.log(shai.schema('now'));
    expect(shai.schema('now')).to.be.a('string');
  });
  it('mid make test', () => {
    console.log(shai.schema('mid'));
    expect(shai.schema('mid')).to.be.a('string');
  });
  it('validcode make test', () => {
    console.log(shai.schema('validcode'));
    expect(shai.schema('validcode')).to.be.a('string');
  });
  it('account make test', () => {
    console.log(shai.schema('account'));
    expect(shai.schema('account')).to.be.a('string');
  });
  it('password make test', () => {
    console.log(shai.schema('password'));
    expect(shai.schema('password')).to.be.a('string');
  });
  it('color make test', () => {
    console.log(shai.schema('color'));
    expect(shai.schema('color')).to.be.a('string');
  });
  it('url make test', () => {
    console.log(shai.schema('url'));
    expect(shai.schema('url')).to.be.a('string');
  });
  it('mail make test', () => {
    console.log(shai.schema('mail'));
    expect(shai.schema('mail')).to.be.a('string');
  });
  it('mobile make test', () => {
    console.log(shai.schema('mobile'));
    expect(shai.schema('mobile')).to.be.a('string');
  });
  it('telphone make test', () => {
    console.log(shai.schema('telphone'));
    expect(shai.schema('telphone')).to.be.a('string');
  });
  it('ip make test', () => {
    console.log(shai.schema('ip'));
    expect(shai.schema('ip')).to.be.a('string');
  });
  it('port make test', () => {
    console.log(shai.schema('port'));
    expect(shai.schema('port')).to.be.a('string');
  });
  it('zipcode make test', () => {
    console.log(shai.schema('zipcode'));
    expect(shai.schema('zipcode')).to.be.a('string');
  });
  it('bizcode make test', () => {
    console.log(shai.schema('bizcode'));
    expect(shai.schema('bizcode')).to.be.a('string');
  });
  it('bankcard make test', () => {
    console.log(shai.schema('bankcard'));
    expect(shai.schema('bankcard')).to.be.a('string');
  });
  it('qq make test', () => {
    console.log(shai.schema('qq'));
    expect(shai.schema('qq')).to.be.a('string');
  });
  it('enName make test', () => {
    console.log(shai.schema('enName'));
    expect(shai.schema('enName')).to.be.a('string');
  });
  it('enMaleName make test', () => {
    console.log(shai.schema('enMaleName'));
    expect(shai.schema('enMaleName')).to.be.a('string');
  });
  it('enFemaleName make test', () => {
    console.log(shai.schema('enFemaleName'));
    expect(shai.schema('enFemaleName')).to.be.a('string');
  });
  it('cnName make test', () => {
    console.log(shai.schema('cnName'));
    expect(shai.schema('cnName')).to.be.a('string');
  });
  it('cnMaleName make test', () => {
    console.log(shai.schema('cnMaleName'));
    expect(shai.schema('cnMaleName')).to.be.a('string');
  });
  it('cnFemaleName make test', () => {
    console.log(shai.schema('cnFemaleName'));
    expect(shai.schema('cnFemaleName')).to.be.a('string');
  });
  it('enState make test', () => {
    console.log(shai.schema('enState'));
    expect(shai.schema('enState')).to.be.a('string');
  });
  it('cnState make test', () => {
    console.log(shai.schema('cnState'));
    expect(shai.schema('cnState')).to.be.a('string');
  });
  it('comDep make test', () => {
    console.log(shai.schema('comDep'));
    expect(shai.schema('comDep')).to.be.a('string');
  });
  it('comPos make test', () => {
    console.log(shai.schema('comPos'));
    expect(shai.schema('comPos')).to.be.a('string');
  });
  it('govDep make test', () => {
    console.log(shai.schema('govDep'));
    expect(shai.schema('govDep')).to.be.a('string');
  });
  it('govPos make test', () => {
    console.log(shai.schema('govPos'));
    expect(shai.schema('govPos')).to.be.a('string');
  });
  it('sex make test', () => {
    console.log(shai.schema('sex'));
    expect(shai.schema('sex')).to.be.a('string');
  });
  it('nation make test', () => {
    console.log(shai.schema('nation'));
    expect(shai.schema('nation')).to.be.a('string');
  });
  it('affiliate make test', () => {
    console.log(shai.schema('affiliate'));
    expect(shai.schema('affiliate')).to.be.a('string');
  });
  it('edu make test', () => {
    console.log(shai.schema('edu'));
    expect(shai.schema('edu')).to.be.a('string');
  });
  it('mary make test', () => {
    console.log(shai.schema('mary'));
    expect(shai.schema('mary')).to.be.a('string');
  });
  it('health make test', () => {
    console.log(shai.schema('health'));
    expect(shai.schema('health')).to.be.a('string');
  });
  it('increment make test', () => {
    console.log(shai.schema('increment'));
    expect(shai.schema('increment')).to.be.a('number');
  });
  it('price make test', () => {
    console.log(shai.schema('price'));
    expect(shai.schema('price')).to.be.a('number');
  });
  it('citycode make test', () => {
    console.log(shai.schema('citycode'));
    expect(shai.schema('citycode')).to.be.a('string');
  });
  it('province make test', () => {
    console.log(shai.schema('province'));
    expect(shai.schema('province')).to.be.a('string');
  });
  it('prefecture make test', () => {
    console.log(shai.schema('prefecture'));
    expect(shai.schema('prefecture')).to.be.a('string');
  });
  it('county make test', () => {
    console.log(shai.schema('county'));
    expect(shai.schema('county')).to.be.a('string');
  });
  it('lon make test', () => {
    console.log(shai.schema('lon'));
    expect(shai.schema('lon')).to.be.a('number');
  });
  it('lat make test', () => {
    console.log(shai.schema('lat'));
    expect(shai.schema('lat')).to.be.a('number');
  });
  it('company make test', () => {
    console.log(shai.schema('company'));
    expect(shai.schema('company')).to.be.a('string');
  });
  it('autocard make test', () => {
    console.log(shai.schema('autocard'));
    expect(shai.schema('autocard')).to.be.a('string');
  });
  it('address make test', () => {
    console.log(shai.schema('address'));
    expect(shai.schema('address')).to.be.a('string');
  });
  it('english make test', () => {
    console.log(shai.schema('english'));
    expect(shai.schema('english')).to.be.a('string');
  });
  it('chinese make test', () => {
    console.log(shai.schema('chinese'));
    expect(shai.schema('chinese')).to.be.a('string');
  });
  it('text make test', () => {
    console.log(shai.schema('text'));
    expect(shai.schema('text')).to.be.a('string');
  });
  it('md5 make test', () => {
    console.log(shai.schema('md5'));
    expect(shai.schema('md5')).to.be.a('string');
  });
  it('uuid make test', () => {
    console.log(shai.schema('uuid'));
    expect(shai.schema('uuid')).to.be.a('string');
  });
  it('bodycard make test', () => {
    console.log(shai.schema('bodycard'));
    expect(shai.schema('bodycard')).to.be.a('string');
  });

});

