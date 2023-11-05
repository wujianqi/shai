import{u as p}from"./shared/shai.2e8c77fb.mjs";var g=Object.defineProperty,b=(a,t,e)=>t in a?g(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e,c=(a,t,e)=>(b(a,typeof t!="symbol"?t+"":t,e),e),y=(a=>(a[a.increment=0]="increment",a[a.uuid=1]="uuid",a))(y||{}),q=(a=>(a[a.some=0]="some",a[a.every=1]="every",a[a.unique=2]="unique",a))(q||{});function j(a,t){return Object.prototype.hasOwnProperty.call(a,t)}class O{constructor(t){c(this,"__datas",[]),c(this,"__opt",{uniqueKey:"id",uniqueType:0}),t&&(this.__datas=t),this.create=this.create.bind(this),this.update=this.update.bind(this),this.read=this.read.bind(this),this.delete=this.delete.bind(this),this.list=this.list.bind(this),this.pageList=this.pageList.bind(this)}__filter(t,e,r){if(!(r===2&&t&&!t[this.__opt.uniqueKey])){const i=t[this.__opt.uniqueKey];let _=[];if(i){const s=this.__opt.uniqueType===0;typeof i=="string"&&s&&/\d+/.test(i)&&(t[this.__opt.uniqueKey]=parseInt(i))}return r===2&&i?_=this.__datas.filter(s=>s[this.__opt.uniqueKey]===t[this.__opt.uniqueKey]):(r===0||r===1)&&(_=this.__datas.filter(s=>Object.keys(t)[r===0?"some":"every"](n=>s[n]===t[n]))),e(_)}}set data(t){t&&t.length&&(this.__datas=t)}get data(){return this.__datas}set config(t){this.__opt=Object.assign(this.__opt,t)}create(t){if(!t)return;const e=Array.isArray(t),r=Array.isArray(this.__datas)&&this.__datas.length>0?this.__datas[0]:e?t[0]:t,i=this.__opt.uniqueType===0,_=Object.keys(r);let s=Array.isArray(this.__datas)&&this.__datas.length>0?this.__datas[this.__datas.length-1][this.__opt.uniqueKey]:0;if(e)for(let n=0;n<t.length;n++){const h=t[n];if(Object.keys(h).every(u=>~_.indexOf(u)))i&&s++,h[this.__opt.uniqueKey]=i?s:p();else return}else{if(r!==t&&!Object.keys(t).every(n=>~_.indexOf(n)))return;i&&s++,t[this.__opt.uniqueKey]=i?s:p()}return this.__datas=this.__datas.concat(t),t}read(t,e){if(t)return this.__filter(t,r=>{if(r.length===1){let i={};return typeof e=="object"&&(i=Object.assign(i,r[0]),i=Object.assign(i,e)),typeof e=="object"?i:r[0]}else return},1)}update(t){if(t)return this.__filter(t,e=>{if(e.length){for(const r in t)j(t,r)&&e[0][r]&&(e[0][r]=t[r]);return e[0]}else return},2)}delete(t){if(!t)return;let e=0;const r=Array.isArray(t)?t:[t],i=[];if(r.forEach(_=>{for(let s=0;s<this.__datas.length;s++){const n=this.__datas[s],h=typeof _=="object"?_[this.__opt.uniqueKey]:_,u=this.__opt.uniqueType===0&&/\d+/.test(h)?parseInt(h):h;if(u===n[this.__opt.uniqueKey]){this.__datas.splice(s,1),i.push(u),e++;break}}}),e>0)return i}list(t){return t&&Object.keys(t).length?this.__filter(t,e=>e.length?e:this.__datas,0):this.__datas}pageList(t,e,r){const i={size:"pageSize",index:"pageIndex"},_={size:"pageSize",index:"pageIndex",total:"pageTotal",count:"pageCount",list:"list"};e&&Object.assign(e,i),r&&Object.assign(r,_);let s=t[i.size],n=t[i.index];if(!s||!n)return;delete t.pageSize,delete t.pageCurrent,typeof s=="string"&&(s=parseInt(s)),typeof n=="string"&&(n=parseInt(n));let h=this.__datas;t&&this.__filter(t,d=>d.length?h=d:this.__datas.length?h=this.__datas:d,0);const u={},l=u[_.total]=h.length,o=u[_.count]=Math.ceil(l/s),f=l-(o-1)*s+(o-1)*s;return u[_.index]=n>o?o:n<1?1:n,u[_.list]=this.__datas.slice((n-1)*s,n<o?n*s:f),u}}export{y as UniqueType,O as default};