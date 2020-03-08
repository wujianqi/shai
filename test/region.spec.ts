import Region from '../src/region';

console.time('test');

//let r = new Region();
let r = new Region(440300);

console.log('lon----', r.latitude());
console.log('lat----', r.longitude());
console.log('citycode----', r.citycode());
console.log('province----', r.province());
console.log('prefecture----', r.prefecture());
console.log('prefecture2----', r.prefecture(true));
console.log('county----', r.county());
console.log('county2----', r.county(true));
console.log('phone----', r.phone());
console.log('zipcode----', r.zipcode());
console.log('idcard----', r.idcard());
console.log('autocard----', r.autocard());

console.timeEnd('test');