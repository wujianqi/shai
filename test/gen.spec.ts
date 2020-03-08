import {rand, date, util, web, cn} from '../src/mock';
import Shai from '../src/shai';
import Region from '../src/region';

console.time('test');
var im1 =  util.incre();
    var im2 =  util.incre(2);
    const { use, gen } = new Shai();
    const region = new Region();
    const company = ()=> region.prefecture(true) + cn.company();

    var setting = {
        length: 3,
        child: 'children',
    };

    var data = {
        setting,
        id : use(im1.val),
        username : use(web.account),
        works: {
            setting: [2, true],
            logs: [
                use(im2.val),
                use(date.time, '', '', 'yyyy-MM-dd'),
                {
                    setting: 2,
                    a:{
                        setting: 3,
                        b: use(company)
                    }
                }
            ]
        }
    }

//console.dir(gen(data));
console.log(JSON.stringify(gen(data)));

console.timeEnd('test');