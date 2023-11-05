import {util, web} from '../src/mock';
import Shai from '../src/generator';
import Access from '../src/access';

console.time('test');

const { use, gen } = new Shai();
const access = new Access();

var im1 =  util.incre();

// 模拟数据
let data = gen({
  setting: 20,
  id : use(im1.val),
  username : use(web.account),
  password : use(web.password)
});

access.data = data;

let dt = access.create({ username: 'admin', password: '123456'});
console.log("新增数据是否成功", dt)

dt = access.read({ username: 'admin', password: '111' })
console.log("是否存在", dt)

dt = access.update({id: 10, username: 'admin2', password: '222222'})
console.log("更新是否成功", dt)

let dt2= access.delete(['11', '28'])
console.log("删除是否成功", dt2)

dt = access.list()
console.log("获取数据列表", dt)

dt = access.pageList({ pageSize: 8, pageIndex: 1 })
console.log("获取分页数据列表", dt)

console.timeEnd('test');
