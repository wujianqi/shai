import {rand, util, web} from '../src/mock';
import Shai from '../src/shai';

console.time('test');

const { use, gen, access } = new Shai();
var im1 =  util.incre();

// 模拟数据
gen({
  setting: 20,
  id : use(im1.val),
  username : use(web.account),
  password : use(web.password)
});

access.create({ username: 'admin', password: '123456'});

access.async('exist',{ username: 'admin', password: '111' }, '成功登录', '账号信息错误')
.then(res => {
  console.log('模拟用户认证', res)
}) 

access.async('update', {id: 10, username: 'admin2', password: '222222'})
.then(res => {
  console.log('模拟修改', res)
  //console.log(access.data)
})

//access.async('delete', [{id: 11, username: 'ddfasd'}, {id: 18}])
access.async('delete', ['11', '18'])
//access.async('delete', ['11', '18'])
.then(res => {
  console.log('模拟删除', res)
  //console.log(access.data)
})

access.async('list')
.then(res => {
  console.log('查询列表', res)
})

/* 
access.async('read', { id: 16 })
.then(res => {
  console.log('模拟数据读取', res)
})

access.async('pageList', { pageSize: '6', pageIndex: '1' }, '')
.then(res => {
  console.log('查询列表', JSON.stringify(res))
}) */

console.timeEnd('test');
