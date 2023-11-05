import {rand, date, util, web, cn} from '../src/mock';
import Shai from '../src/index';
import Region from '../src/region';

console.time('test');
 var im1 =  util.incre();
    var im2 =  util.incre(2);
    const { use, gen } = new Shai();
    const region = new Region();
    const company = ()=> region.prefecture(true) + cn.company();

    var data = {
        setting: 3,
        id : use(im1.val),
        username : use(web.account),
        works: {
            setting: {
                length: 2, 
                level: 2,                 
            },
            t: 45,
            logs: [
                use(im2.val),
                use(date.time, '', '', 'yyyy-MM-dd'),
                {
                    a:{
                        //setting: 3,
                        b: use(company)
                    }
                }
            ]
        }
    }

    /* var data = {
        setting: {length:10, level:3},
        id: use(im1.val),
        account:use(web.account),
        name: use(cn.fullName),
        idcard: use(cn.idcard),
        autocard: use(cn.autocard),
        logintime: use(date.time)
      } */

//gen(data);
console.log(JSON.stringify(gen(data)));

console.timeEnd('test');