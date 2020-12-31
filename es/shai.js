var t,e,r=function(t){void 0===t&&(t="-");var e=(new Date).getTime();return["xxxxxxxx","xxxx","4xxx","yxxx","xxxxxxxxxxxx"].join(t).replace(/[xy]/g,(function(t){var r=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===t?r:3&r|8).toString(16)}))};function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function i(t,e){if(Object.assign)return Object.assign(t,e);for(var r in e)n(e,r)&&(t[r]=e[r]);return t}!function(t){t[t.increment=0]="increment",t[t.uuid=1]="uuid"}(t||(t={})),function(t){t[t.some=0]="some",t[t.every=1]="every",t[t.unique=2]="unique"}(e||(e={}));var s=["操作失败！","查询参数错误！","没有请求参数","操作成功！"],a=function(){function a(){this.__datas=[],this.__opt={uniqueKey:"id",uniqueType:t.increment,asyncResult:function(t){return[200,t]},success:function(t,e){return{code:0,message:"string"!=typeof e?s[3]:e,data:t}},failure:function(t,e){return{code:500,message:"string"!=typeof e?s[0]:e}}},this.exist=this.exist.bind(this),this.create=this.create.bind(this),this.update=this.update.bind(this),this.read=this.read.bind(this),this.delete=this.delete.bind(this),this.list=this.list.bind(this),this.pageList=this.pageList.bind(this),this.asyncExist=this.asyncExist.bind(this),this.asyncCreate=this.asyncCreate.bind(this),this.asyncUpdate=this.asyncUpdate.bind(this),this.asyncRead=this.asyncRead.bind(this),this.asyncDelete=this.asyncDelete.bind(this),this.asyncList=this.asyncList.bind(this),this.asyncPageList=this.asyncPageList.bind(this)}return a.prototype.__filter=function(r,n,i){var a=this;if(i===e.unique&&r&&!r[this.__opt.uniqueKey])return this.__opt.failure(1,s[1]);var o=r[this.__opt.uniqueKey],u=[];if(o){var c=this.__opt.uniqueType===t.increment;"string"==typeof o&&c&&/\d+/.test(o)&&(r[this.__opt.uniqueKey]=parseInt(o))}return i===e.unique&&o?u=this.__datas.filter((function(t){return t[a.__opt.uniqueKey]===r[a.__opt.uniqueKey]})):i!==e.some&&i!==e.every||(u=this.__datas.filter((function(t){return Object.keys(r)[i===e.some?"some":"every"]((function(e){return t[e]===r[e]}))}))),n(u)},a.prototype.__async=function(t,e){var r=this;if(void 0===e&&(e=200),!Promise)throw new Error("运行环境不支持异步！");return new Promise((function(n){setTimeout((function(){n(r.__opt.asyncResult(t()))}),e)}))},a.prototype.__noparam=function(){return this.__opt.failure(2,s[2])},Object.defineProperty(a.prototype,"data",{get:function(){return this.__datas},set:function(t){t&&t.length&&(this.__datas=t)},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"config",{set:function(t){this.__opt=i(this.__opt,t)},enumerable:!0,configurable:!0}),a.prototype.create=function(e,n,i){if(!e)return this.__noparam();var s=Array.isArray(e),a=this.__datas.length?this.__datas[0]:s?e[0]:e,o=this.__opt.uniqueType===t.increment,u=Object.keys(a),c=this.__datas.length?this.__datas[this.__datas.length-1][this.__opt.uniqueKey]:0;if(s)for(var _=0;_<e.length;_++){var h=e[_];if(!Object.keys(h).every((function(t){return~u.indexOf(t)})))return this.__opt.failure(0,i);o&&c++,h[this.__opt.uniqueKey]=o?c:r()}else{if(a!==e&&!Object.keys(e).every((function(t){return~u.indexOf(t)})))return this.__opt.failure(0,i);o&&c++,e[this.__opt.uniqueKey]=o?c:r()}return this.__datas=this.__datas.concat(e),this.__opt.success(e,n)},a.prototype.asyncCreate=function(t,e,r,n){var i=this;return this.__async((function(){return i.create(t,e,r)}),n)},a.prototype.update=function(t,r,i){var s=this;return t?this.__filter(t,(function(e){if(e.length){for(var a in t)n(t,a)&&e[0][a]&&(e[0][a]=t[a]);return s.__opt.success(e[0],r)}return s.__opt.failure(0,i)}),e.unique):this.__noparam()},a.prototype.asyncUpdate=function(t,e,r,n){var i=this;return this.__async((function(){return i.update(t,e,r)}),n)},a.prototype.read=function(t,r,n,s){var a=this;return t?this.__filter(t,(function(t){if(1===t.length){var e={};return"object"==typeof s&&(e=i(e,t[0]),e=i(e,s)),a.__opt.success("object"==typeof s?e:t[0],r)}return a.__opt.failure(0,n)}),e.every):this.__noparam()},a.prototype.asyncRead=function(t,e,r,n,i){var s=this;return this.__async((function(){return s.read(t,e,r,n)}),i)},a.prototype.delete=function(e,r,n){var i=this;if(!e)return this.__noparam();Array.isArray(e)||(e=[e]);var s=0;return e.forEach((function(e){for(var r=0;r<i.__datas.length;r++){var n=i.__datas[r],a="object"==typeof e?e[i.__opt.uniqueKey]:e;if((i.__opt.uniqueType===t.increment&&/\d+/.test(a)?parseInt(a):a)===n[i.__opt.uniqueKey]){i.__datas.splice(r,1),s++;break}}})),s>0?this.__opt.success(0,r):this.__opt.failure(0,n)},a.prototype.asyncDelete=function(t,e,r,n){var i=this;return this.__async((function(){return i.delete(t,e,r)}),n)},a.prototype.exist=function(t,r,n,s){var a=this;return t?this.__filter(t,(function(t){if(1===t.length){var e={};return"object"==typeof s&&(e=i(e,t[0]),e=i(e,s)),a.__opt.success("object"==typeof s?e:t[0],r)}return a.__opt.failure(0,n)}),e.every):this.__noparam()},a.prototype.asyncExist=function(t,e,r,n,i){var s=this;return this.__async((function(){return s.exist(t,e,r,n)}),i)},a.prototype.list=function(t,r){var n=this;return t&&Object.keys(t).length?this.__filter(t,(function(t){return t.length?n.__opt.success(t,r):n.__opt.success(n.__datas,r)}),e.some):this.__opt.success(this.__datas,r)},a.prototype.asyncList=function(t,e,r){var n=this;return this.__async((function(){return n.list(t,e)}),r)},a.prototype.pageList=function(t,r,n){var i=this,s=t.pageSize,a=t.pageIndex;if(!s||!a)return this.__noparam();"string"==typeof s&&(s=parseInt(s)),"string"==typeof a&&(a=parseInt(a));var o=this.__datas;r&&this.__filter(r,(function(t){return t.length?o=t:i.__datas.length?o=i.__datas:t}),e.some);var u=o.length,c=Math.ceil(u/s),_=a>c?c:a<1?1:a,h=u-(c-1)*s+(c-1)*s,p=this.__datas.slice((a-1)*s,a<c?a*s:h);return this.__opt.success({total:u,pageIndex:_,pageSize:s,pageCount:c,list:p},n)},a.prototype.asyncPageList=function(t,e,r,n){var i=this;return this.__async((function(){return i.pageList(t,e,r)}),n)},a}(),o=Symbol?Symbol():"▒";function u(t){var e=Array.isArray(t)?[]:{};for(var r in t)if(n(t,r)){var i=t[r];e[r]="object"==typeof i?u(i):i}return e}var c=function(){function t(){this.__funcs=[],this.__data=[],this.__propKey="setting",this.__access=new a,this.use=this.use.bind(this),this.gen=this.gen.bind(this)}return t.prototype.setv=function(t,e){var r=t.length-1;t.reduce((function(t,n,i){return i===r&&(t[n]=e),t[n]}),this.__data)},t.prototype.addChild=function(t,e,r){var n=r.key||"children",i=this.getList(t,r);if(e<1)return i;var s=u(i);e--;for(var a=0,o=s.length;a<o;a++)s[a][n]=1===e?u(i):this.addChild(i[a],e,r);return s},t.prototype.getList=function(t,e){if(e){var r=function(t){var e=1;return"number"==typeof t?e=t:Array.isArray(t)&&"number"==typeof t[0]&&"number"==typeof t[1]&&(e=~~(Math.random()*(t[1]-t[0])+t[0])),e},n="number"==typeof e||Array.isArray(e)&&"number"==typeof e[0]&&"number"==typeof e[1]?r(e):"object"==typeof e&&e.length?r(e.length):1,i=new Array(n);delete t[this.__propKey];for(var s=0;s<n;s++)i[s]=u(t);t=i}return t},t.prototype.parseBlock=function(){var t=this,e=function(r,i){!Array.isArray(r)&&n(r,t.__propKey)&&(r=function(e){var r=e[t.__propKey];if(Array.isArray(r)||"object"!=typeof r)e=t.getList(e,r);else{var n="number"==typeof r.level?r.level:1;e=t.addChild(e,n,r)}return e}(r),i?t.setv(i,r):t.setv([],t.__data=r));var s=function(t){if(n(r,t)){var s=r[t];Array.isArray(s)&&s[0]!==o?s.forEach((function(r,n){return e(r,i?i.concat([t,n]):[t,n])})):Array.isArray(s)||"object"!=typeof s||e(s,i?i.concat([t]):[t])}};for(var a in r)s(a)};e(this.__data)},t.prototype.setValues=function(t,e){var r=this;if(Array.isArray(t))if(t[0]===o){var n=e||[],i=this.__funcs[t[1]].concat();try{this.setv(n,i.length>0?i[0].apply(i,i[1]):t)}catch(e){throw new Error((n.length>0?n.join("."):t)+": error, "+e)}}else t.forEach((function(t,n){return r.setValues(t,e?e.concat([n]):[n])}));else"object"==typeof t&&Object.keys(t).forEach((function(n){return r.setValues(t[n],e?e.concat([n]):[n])}))},t.prototype.use=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return[o,this.__funcs.push([t,e])-1]},t.prototype.gen=function(t,e){if("object"==typeof t)return e&&(this.__propKey=e),this.__data=t,this.parseBlock(),this.setValues(this.__data),this.__access.data=this.__data,this.__data},Object.defineProperty(t.prototype,"access",{get:function(){return this.__access},enumerable:!0,configurable:!0}),t}();export default c;
//# sourceMappingURL=shai.js.map
