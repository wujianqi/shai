import u from"./random.mjs";import{I as d,r as k,u as w,f as s}from"./shared/shai.2e8c77fb.mjs";const C="\u4E91\u821F\u5DE8\u9E4F\u98DE\u6377\u534E\u7984\u5BCC\u745E\u5929\u9686\u76CA\u529B\u53D1\u6587\u5316\u4E16\u65B0\u91D1\u6DA6\u5BFF\u5B8F\u5EB7\u4E30\u672C\u6052\u660E\u5927\u5148\u5F18\u6625\u5229\u5982\u4F1F\u8D35\u957F\u8FBE\u5FB7\u5149\u5B89\u7FD4\u7AE5\u9752\u5174\u7F8E\u73AF\u6613\u9510\u535A\u6D9B\u540C\u8F89\u6D2A\u6668\u805A\u4F73\u4ED9\u6E0A\u52E4\u767E\u5168\u6C47\u51EF\u6167\u8D85\u5E86\u4EC1\u4E1C\u661F\u590F\u9633\u57CE\u5343\u5E7F\u798F\u4E07\u7545\u5B9D\u65FA\u8FDB\u5408\u548C\u96C5\u6D69\u6210\u6EE1\u7965\u5947\u6C38\u5E73\u5347\u4E3D\u9F0E\u7ACB\u901A\u610F\u8FEA\u5065\u67CF\u53CB\u5CF0\u94ED\u80DC\u5764",a="\u674E\u738B\u5F20\u5218\u9648\u6768\u8D75\u9EC4\u5468\u5434\u5F90\u5B59\u80E1\u6731\u9AD8\u6797\u4F55\u90ED\u9A6C\u7F57\u6881\u5B8B\u90D1\u8C22\u97E9\u5510\u51AF\u4E8E\u8463\u8427\u7A0B\u66F9\u8881\u9093\u8BB8\u5085\u6C88\u66FE\u5F6D\u5415\u82CF\u5362\u848B\u8521\u8D3E\u4E01\u9B4F\u859B\u53F6\u960E\u4F59\u6F58\u675C\u6234\u590F\u949F\u6C6A\u7530\u4EFB\u59DC",l="\u82B3\u5A1C\u654F\u9759\u4E3D\u8273\u5A1F\u971E\u79C0\u71D5\u73B2\u6842\u4E39\u840D\u7EA2\u7389\u5170\u82F1\u6885\u8389\u73CD\u96EA\u5E05\u6167\u5B81\u5A77\u51E4\u6676\u6B22\u9896\u4F73\u5029\u7434\u4E91\u6D01\u67F3\u6DD1\u6668\u8363\u83B9\u4E91\u5A77\u7433\u6B23\u535A\u9999\u829D\u6960\u971E\u745C\u7490",m="\u4F1F\u5F3A\u78CA\u6D0B\u52C7\u519B\u6770\u6D9B\u8D85\u660E\u521A\u5E73\u8F89\u9E4F\u534E\u98DE\u946B\u6CE2\u658C\u5B87\u6D69\u51EF\u5065\u4FCA\u5E06\u5E05\u65ED\u9F99\u6797\u9633\u4EAE\u6210\u5EFA\u5CF0\u56FD\u519B\u6668\u745E\u5FD7\u5175\u96F7\u4E1C\u535A\u5F6C\u5764\u60F3\u5CA9\u6768\u6587\u5229\u8F69",r=["Smith","Johnson","Williams","Jones","Brown","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson"],c=["James","John","Robert","Michael","William","David","Richard","Charles","Joseph","Thomas","Christopher","Daniel","Paul","Mark","Donald","George","Kenneth","Steven","Edward","Brian"],p=["Mary","Patricia","Linda","Barbara","Elizabeth","Jennifer","Maria","Susan","Margaret","Dorothy","Lisa","Nancy","Karen","Betty","Helen","Sandra","Donna","Carol","Ruth","Sharon"],f=["United States","China","Japan","Germany","United Kingdom","France","India","Italy","Brazil","Canada","South Korea","Russia","Australia","Spain","Mexico","Indonesia","Turkey","Netherlands","Switzerland"],y=["\u7F8E\u56FD","\u4E2D\u56FD","\u65E5\u672C","\u5FB7\u56FD","\u82F1\u56FD","\u6CD5\u56FD","\u5370\u5EA6","\u610F\u5927\u5229","\u5DF4\u897F","\u52A0\u62FF\u5927","\u97E9\u56FD","\u4FC4\u7F57\u65AF","\u6FB3\u5927\u5229\u4E9A","\u897F\u73ED\u7259","\u58A8\u897F\u54E5","\u5370\u5EA6\u5C3C\u897F\u4E9A","\u571F\u8033\u5176","\u8377\u5170","\u745E\u58EB"],M=["\u80A1\u4EFD","\u79D1\u6280","\u7535\u5B50","\u5B9E\u4E1A","\u5546\u8D38","\u673A\u68B0","\u670D\u88C5","\u5E7F\u544A","\u5EFA\u6750","\u7269\u6D41","\u80FD\u6E90","\u529E\u516C\u7528\u54C1","\u4FE1\u8D37","\u57F9\u8BAD","\u9152\u5E97","\u623F\u5730\u4EA7","\u98DF\u54C1","\u6C7D\u8F66\u670D\u52A1","\u4E94\u91D1"],g=["\u65B0\u6751","\u82B1\u56ED","\u5C0F\u533A","\u82D1","\u5927\u53A6","\u516C\u5BD3","\u697C","\u5E7F\u573A","\u57CE"],S=["\u5EFA\u8BBE","\u4EBA\u6C11","\u6587\u5316","\u8FCE\u5BBE","\u671D\u9633","\u80B2\u624D","\u632F\u5174","\u5149\u660E","\u5E78\u798F","\u89E3\u653E","\u56E2\u7ED3","\u548C\u5E73","\u65B0\u534E","\u897F\u73AF","\u80DC\u5229","\u5357\u73AF","\u5E73\u5B89","\u5411\u9633","\u6EE8\u6CB3","\u4E1C\u73AF"],N=["\u8DEF","\u8857","\u5927\u9053"],B=["com","cn","com.cn","net"],b=[11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65],Y=["\u5317\u4EAC\u5E02","\u5929\u6D25\u5E02","\u6CB3\u5317\u7701","\u5C71\u897F\u7701","\u5185\u8499\u53E4\u81EA\u6CBB\u533A","\u8FBD\u5B81\u7701","\u5409\u6797\u7701","\u9ED1\u9F99\u6C5F\u7701","\u4E0A\u6D77\u5E02","\u6C5F\u82CF\u7701","\u6D59\u6C5F\u7701","\u5B89\u5FBD\u7701","\u798F\u5EFA\u7701","\u6C5F\u897F\u7701","\u5C71\u4E1C\u7701","\u6CB3\u5357\u7701","\u6E56\u5317\u7701","\u6E56\u5357\u7701","\u5E7F\u4E1C\u7701","\u5E7F\u897F\u58EE\u65CF\u81EA\u6CBB\u533A","\u6D77\u5357\u7701","\u91CD\u5E86\u5E02","\u56DB\u5DDD\u7701","\u8D35\u5DDE\u7701","\u4E91\u5357\u7701","\u897F\u85CF\u81EA\u6CBB\u533A","\u9655\u897F\u7701","\u7518\u8083\u7701","\u9752\u6D77\u7701","\u5B81\u590F\u56DE\u65CF\u81EA\u6CBB\u533A","\u65B0\u7586\u7EF4\u543E\u5C14\u81EA\u6CBB\u533A"],T="\u4EAC\u6D25\u5180\u664B\u8499\u9ED1\u5409\u8FBD\u6CAA\u82CF\u6D59\u7696\u95FD\u8D63\u9C81\u6E58\u9102\u8C6B\u7CA4\u6842\u743C\u5DDD\u4E91\u8D35\u85CF\u9655\u7518\u9752\u5B81\u65B0",J={incre:(t,E)=>new d(t,E),range:k,uuid:w},H={repeat:(t=1,E="\u586B\u5145\u6587\u672C\u6837\u5F0F")=>E.repeat?E.repeat(t):new Array((t||10)+1).join(E),chinese:t=>{const E=t||u.int(5,10),i=new Array(E);for(let F=0;F<E;F++)i[F]=u.str(1,C);return i.join("")}},h={time(t,E,i="YYYY/MM/DD HH:mm:ss"){const F=t?new Date(t).getTime():-288e5,D=E?new Date(E).getTime():new Date().getTime(),e=new Date(u.int(F,D));return s(e,i)},now:(t="YYYY/MM/DD HH:mm:ss")=>s(new Date,t),year:(t=1975)=>u.int(t,new Date().getFullYear()),month:()=>u.int(1,12),day:()=>u.int(1,28),hour:()=>u.int(1,24),minute:()=>u.int(0,59)},R={firstName:()=>u.str(1,a),maleName:()=>u.str(1,a)+u.str(u.int(1,2),m),femaleName:()=>u.str(1,a)+u.str(u.int(1,2),l),fullName:()=>u.str(1,a)+(u.bool()?u.str(u.int(1,2),m):u.str(u.int(1,2),l)),mobile:()=>u.pick(["13"+u.int(1,9),"15"+u.numstr(1),"17"+u.str(1,"018")])+u.numstr(8),idcard:()=>{const t=n=>n<10?"0"+n:""+n,E=[u.pick(b),0,u.int(1,5),0,u.int(1,5),h.year(),t(u.int(1,12)),t(u.int(1,28)),u.numstr(3)].join(""),i=E.split(""),F=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],D=[1,0,"X",9,8,7,6,5,4,3,2];let e=0,o=0,A=0;for(let n=0;n<17;n++)o=+i[n],A=F[n],e+=o*A;return E+String(D[e%11])},autocard:()=>u.str(1,T)+u.str(1,"ABCD")+u.shuffle(u.str(1,"ABCDEFGHJKLMNPQRSTUWYZ")+u.numstr(4)),company:()=>u.str(u.int(2,3),C)+u.pick(M)+"\u6709\u9650\u516C\u53F8",country:()=>u.pick(y),road:()=>[u.pick(S),u.pick(N),u.pick(["1","2","3"]),u.numstr(u.int(1,3)),"\u53F7"].join(""),build:()=>u.str(2,C)+u.pick(g),phone:()=>u.str(1,"826")+u.numstr(u.int(6,7)),zipcode:()=>u.bool()?"0"+u.int(1,7).toString():u.int(1,9).toString()+u.int(0,7).toString()+u.numstr(4),province:()=>u.pick(Y)},j={firstName:()=>u.pick(r),maleName:()=>u.pick(c)+" "+u.pick(r),femaleName:()=>u.pick(p)+" "+u.pick(r),fullName:()=>(u.bool()?u.pick(c):u.pick(p))+" "+u.pick(r),country:()=>u.pick(f)},z={account:()=>u.letter(1,!0)+u.plus(3,"-")+u.alphanum(4),password:()=>{const t="`~!@#$%^&*",E=u.str(1,t)+u.letter(1,!0,!1)+u.numstr(1)+u.plus(4,t);return u.letter(1,!0)+u.shuffle(E)},qq:()=>+(u.int(1,2).toString()+u.numstr(u.int(5,10))),domain:()=>u.alphanum(u.int(3,8))+"."+u.pick(B),url:(t="https")=>t+"://www."+u.alphanum(u.int(3,8))+"."+u.pick(B)+u.once("/"+u.letter(u.int(3,8))),email:()=>[u.letter(u.int(3,8))+"@"+u.alphanum(u.int(3,8)),u.pick(B)].join("."),ip:(t=!1)=>(t?u.pick(["192.168.","172.16.","10.0."]):u.int(10,255)+"."+u.int(1,255)+".")+u.int(0,255)+"."+u.int(1,255),color:()=>"#"+u.hex(6)};export{R as cn,h as date,j as en,u as rand,H as text,J as util,z as web};
