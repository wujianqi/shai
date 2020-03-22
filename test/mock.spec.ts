import {rand, util, cn, en, web, text, date} from '../src/mock';

console.time('test');

console.log('now----', date.now());
console.log('uuid----', util.uuid());
console.log('enum----', rand.pick(['aa','bb','cc']));
console.log('range----', util.range(10, 15));
console.log('int ----', rand.int());
console.log('int2 ----', rand.int(-288, 15088000));
console.log('int3 ----', rand.int(-28800000, 1584830722508));
console.log('number ----', rand.number(100000,200000,1));
console.log('bool ----', rand.bool());
console.log('datetime ----', date.time());
console.log('datetime2 ----', date.time('2000/10/01', new Date(), 'yyyy-MM-dd hh:mm:ss'));
console.log('alphanum ----', rand.alphanum());
console.log('account ----', web.account()); 
console.log('password ----', web.password());
console.log('color ----', web.color());
console.log('url ----', web.url());
console.log('mail ----', web.email());
console.log('mobile ----', cn.mobile());
console.log('phone ----',cn.phone());
console.log('ip ----', web.ip());
console.log('enName ----', en.fullName());
console.log('enMaleName ----', en.maleName());
console.log('enFemaleName ----', en.femaleName());
console.log('cnName make ----', cn.fullName());
console.log('cnMaleName ----', cn.maleName());
console.log('cnFemaleName ----', cn.femaleName());
console.log('enState ----', en.country());
console.log('cnState ----', cn.country());
console.log('province----', cn.province());
console.log('zipcode----', cn.zipcode());
console.log('idcard----', cn.idcard());
console.log('autocard----', cn.autocard());
console.log('company----', cn.company());
console.log('year----', date.year());
console.log('repeat----', text.repeat());
console.log('chinese----', text.chinese());
console.log('road----', cn.road());
console.log('build----', cn.build());

console.timeEnd('test');




