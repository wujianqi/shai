const Shai = require('../lib/shai'); 
const { util, web } = require('../lib/mock');

console.log(Shai);
var shai = new Shai();
var access = shai.access;
var im1 =  util.incre();

shai.gen({
  setting: 30,
  id: shai.use(im1.val),
  username: shai.use(web.account),
  password: shai.use(web.password)
});

console.log(access.create({ username: 'admin', password: '111111'}));
console.log(access.pageList({pageSize: 5, pageIndex: 2}))