const e="abcdefghijklmnopqrstuvwxyz",s="0123456789";function c(t=1,r=10){return Math.floor(Math.random()*(1+r-t))+t}function u(){return Math.random()<.5}function l(t=1,r=100,o){return o&&o>=1?+(Math.random()*(1+r-t)+t).toFixed(o):c(t,r)}function p(t,r){const o=()=>t.length>0?t[~~(Math.random()*t.length)]:void 0;if(typeof r=="number"){const n=new Array(r);for(let a=0;a<r;a++)n[a]=o();return n}else return o()}function f(t,r){let o="";const n=Math.ceil(t/11);for(let a=0;a<n;a++)o+=Math.random().toString(r).slice(2);return o.slice(0,t)}function i(t=10,r){if(t>55&&!r)return f(t,36);r=r||e+s;const o=new Array(t);for(let n=0;n<t;n++)o[n]=r.charAt(~~(Math.random()*r.length));return o.join("")}function h(t){const r=()=>u()?-1:1;return Array.isArray(t)?t.sort(r):typeof t=="string"?Array.from(t).sort(r).join(""):t}const m={int:c,number:l,pick:p,str:i,shuffle:h,bool:u,once:t=>u()?typeof t=="string"?t:typeof t=="number"?String(t):"":"",letter:(t=10,r=!1,o=!0)=>i(t,r?o?e+e.toUpperCase():e.toUpperCase():e),numstr:(t=10)=>f(t,10),alphanum:(t=10,r=!1)=>r?i(t,e+e.toUpperCase()+s):i(t),plus:(t,r)=>i(t,e+e.toUpperCase()+s+r),hex:(t=6)=>f(t,16)};export{m as default};
