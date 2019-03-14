import 'mocha';
// import assert from 'power-assert';
import Shai from '../src/index';

describe('单项数据生成与模拟测试 maker test', function () {
    var m = new Shai({
        divisionCode: '350205'
    }).maker
    
    it('now', function () {
        console.log(m.get('now'));
    });
    it('md5', function () {
        console.log(m.get('md5', m.get('now'), true));
    });
    it('uuid', function () {
        console.log(m.get('uuid', ''));
    });

    it('enum make test', () => {
        console.log(m.get('enum','aa','bb','cc'));
    });
    it('int make test', () => {
        console.log(m.get('int'));
    });
    it('number make test', () => {
        console.log(m.get('number',100000,200000,1));
    });
    it('bool make test', () => {
        console.log(m.get('bool'));
    });
    it('datetime make test', () => {
        console.log(m.get('datetime'));
    });
    it('date make test', () => {
        console.log(m.get('date'));
    });
    it('time make test', () => {
        console.log(m.get('time'));
    });
    it('year make test', () => {
        console.log(m.get('year'));
    });
    it('month make test', () => {
        console.log(m.get('month'));
    });
    it('day make test', () => {
        console.log(m.get('day'));
    });
    it('hour make test', () => {
        console.log(m.get('hour'));
    });
    it('minute make test', () => {
        console.log(m.get('minute'));
    });
    it('mid make test', () => {
        console.log(m.get('mid'));
    });
    it('validcode make test', () => {
        console.log(m.get('validcode'));
    });
    it('account make test', () => {
        console.log(m.get('account'));
    });
    it('password make test', () => {
        console.log(m.get('password'));
    });
    it('color make test', () => {
        console.log(m.get('color'));
    });
    it('url make test', () => {
        console.log(m.get('url'));
    });
    it('mail make test', () => {
        console.log(m.get('mail'));
    });
    it('mobile make test', () => {
        console.log(m.get('mobile'));
    });
    it('phone make test', () => {
        console.log(m.get('phone'));
    });
    it('ip make test', () => {
        console.log(m.get('ip'));
    });
    it('port make test', () => {
        console.log(m.get('port'));
    });
    it('zipcode make test', () => {
        console.log(m.get('zipcode'));
    });
    it('bizcode make test', () => {
        console.log(m.get('bizcode'));
    });
    it('bankcard make test', () => {
        console.log(m.get('bankcard'));
    });
    it('qq make test', () => {
        console.log(m.get('qq'));
    });
    it('enName make test', () => {
        console.log(m.get('enName'));
    });
    it('enMaleName make test', () => {
        console.log(m.get('enMaleName'));
    });
    it('enFemaleName make test', () => {
        console.log(m.get('enFemaleName'));
    });
    it('cnName make test', () => {
        console.log(m.get('cnName'));
    });
    it('cnMaleName make test', () => {
        console.log(m.get('cnMaleName'));
    });
    it('cnFemaleName make test', () => {
        console.log(m.get('cnFemaleName'));
    });
    it('enState make test', () => {
        console.log(m.get('enState'));
    });
    it('cnState make test', () => {
        console.log(m.get('cnState'));
    });    
    it('price make test', () => {
        console.log(m.get('price'));
    });

    it('province', function () {
        console.log(m.get('province'));
    });
    it('prefecture', function () {
        console.log(m.get('prefecture'));
    });
    it('county', function () {
        console.log(m.get('county'));
    });
    it('zipcode', function () {
        console.log(m.get('zipcode'));
    });
    it('bodycard', function () {
        console.log(m.get('bodycard'));
    });
    it('autocard', function () {
        console.log(m.get('autocard'));
    });
    it('address', function () {
        console.log(m.get('address'));
    });
    it('company', function () {
        console.log(m.get('company'));
    });
    it('lon', function () {
        console.log(m.get('lon'));
    });
    it('lat', function () {
        console.log(m.get('lat'));
    });

});