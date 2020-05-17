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

access.asyncExist({ username: 'admin', password: '123456' })
.then(res => {
  console.log('模拟用户认证', res)
}) 

access.asyncUpdate({id: 10, username: 'admin2', password: '222222'})
.then(res => {
  console.log('模拟修改', res)
  //console.log(access.data)
})

//access.delete([{id: 11}, {id: 18}])
//access.delete(['11', '18'])
access.asyncDelete(['11', '18'])
.then(res => {
  console.log('模拟删除', res)
  //console.log(access.data)
})

access.asyncRead({ id: 16 })
.then(res => {
  console.log('模拟数据读取', res)
})

access.asyncList({ username:'admin' })
.then(res => {
  console.log('查询列表', res)
})

access.asyncPageList({ pageSize: 6, pageIndex: 1 })
.then(res => {
  console.log('查询列表', JSON.stringify(res))
})

console.timeEnd('test');
