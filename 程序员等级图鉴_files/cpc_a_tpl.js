define("appmsg/retry_ajax.js",["biz_wap/utils/ajax.js","biz_wap/jsapi/core.js"],function(require,exports,module,alert){
"use strict";
function Retry_ajax(e){
checkAjaxDo(e),e&&(e.success=function(a){
dealWithSucceed(a,e);
},e.error=function(){
dealWithFailed(e);
}),ajax(e);
}
function checkAjaxDo(e){
var a=isContainExceptLike(e,failedQueue),i=isContainAjax(e,failedQueue);
-1===i&&a>-1&&failedQueue.splice(a,1);
}
function isContainExceptLike(e,a){
var i=-1;
for(var r in a){
var t=a[r];
if(e.url||-1!=e.url.indexOf("&like=")||-1!=t.url.indexOf("&like=")){
if(!(e.url.indexOf("&like=")>-1&&t.url.indexOf("&like=")>-1))continue;
if(removeLikeParam(e.url)!==removeLikeParam(t.url))continue;
}else if(!t.url||t.url!==e.url)continue;
if(e.data&&t.data){
var u=e.data,n=t.data;
if(!isEqualExceptLike(u,n))continue;
}
i=r;
break;
}
return i;
}
function isContainAjax(e,a){
var i=-1;
for(var r in a){
var t=a[r];
if(e.url&&t.url&&e.url==t.url){
if(e.data&&t.data){
var u=e.data,n=t.data;
if(!isEqual(u,n))continue;
}
i=r;
break;
}
}
return i;
}
function removeLikeParam(e){
var a=e.indexOf("&like="),i=e.substring(0,a)+e.substring(a+7);
return i;
}
function isEqualExceptLike(e,a){
var i=Object.getOwnPropertyNames(e),r=Object.getOwnPropertyNames(a);
if(i.length!=r.length)return!1;
for(var t=0;t<i.length;t++){
var u=i[t];
if("like"!==u&&e[u]!==a[u])return!1;
}
return!0;
}
function isEqual(e,a){
var i=Object.getOwnPropertyNames(e),r=Object.getOwnPropertyNames(a);
if(i.length!=r.length)return!1;
for(var t=0;t<i.length;t++){
var u=i[t];
if(e[u]!==a[u])return!1;
}
return!0;
}
function dealWithSucceed(res,obj){
try{
var data=eval("("+res+")");
}catch(e){
var data=!1;
}
if(data&&data.base_resp&&0===data.base_resp.ret){
var findIndex=isContainExceptLike(obj,failedQueue);
findIndex>-1&&failedQueue.splice(findIndex,1);
}else dealWithFailed(obj);
}
function dealWithFailed(e){
var a=isContainExceptLike(e,failedQueue);
if(-1===a){
if(e.failedTimes=1,failedQueue.length>=MAX_QUEUE_LEN)return;
failedQueue.push(e);
}else{
var i=isContainAjax(e,failedQueue);
if(i>-1){
if(failedQueue[a].failedTimes++,e.failedTimes=failedQueue[a].failedTimes,e.failedTimes>MAX_FAILED_TIMES)return void failedQueue.splice(i,1);
}else failedQueue.splice(i,1),e.failedTimes=1,failedQueue.push(e);
}
Retry_ajax(e);
}
var ajax=require("biz_wap/utils/ajax.js"),JSAPI=require("biz_wap/jsapi/core.js"),failedQueue=[],MAX_FAILED_TIMES=2,MAX_QUEUE_LEN=20;
return Retry_ajax;
});define("complain/tips.js",["biz_common/utils/string/html.js","biz_common/dom/event.js"],function(t){
"use strict";
t("biz_common/utils/string/html.js");
var i=t("biz_common/dom/event.js"),o={
tipsTimeoutId:null,
tipsDom:document.getElementById("tips")
},s={
showErrTips:function(t,i){
var s=i||o.tipsDom;
return t===!1?void(s.style.display="none"):(this.resetTips(),s.innerHTML=t.htmlEncode(),
s.style.display="block",clearTimeout(o.tipsTimeoutId),void(o.tipsTimeoutId=setTimeout(function(){
s.style.display="none";
},4e3)));
},
resetTips:function(t){
setTimeout(function(){
var i=t||o.tipsDom;
i&&(i.style.top=document.body.scrollTop+"px");
},0);
}
};
return i.on(window,"scroll",function(){
s.resetTips();
}),s;
});define("pages/loadscript.js",[],function(){
"use strict";
function e(t){
e.counter||(e.counter=1);
var n="number"!=typeof t.retry?1:t.retry,o=t.win||window,r=o.document,a=r.createElement("script"),i=t.type||"JSONP",d=r.head||r.getElementsByTagName("head")[0]||r.documentElement,l=t.callbackName,c="uninitialized",u="undefined"==typeof t.successCode?200:t.successCode,s="undefined"==typeof t.timeoutCode?500:t.timeoutCode,f="undefined"==typeof t.scriptErrorCode?400:t.scriptErrorCode,m=!1,p=null;
"JSONP"!=i&&"JS"!=i&&(i="JSONP");
var y="";
y="JSONP"==i?t.url+"&t="+Math.random():t.url;
var h=function(e){
a&&!m&&(m=!0,p&&(clearTimeout(p),p=null),a.onload=a.onreadystatechange=a.onerror=null,
d&&a.parentNode&&d.removeChild(a),a=null,l&&-1==l.indexOf(".")&&(window[l]=null),
"JS"==i&&e==u&&"loaded"==c&&"function"==typeof t.callback?t.callback():e!=u&&"loaded"!=c&&"function"==typeof t.onerror&&t.onerror(e));
};
if(l&&"function"==typeof t.callback&&"JSONP"==i){
var w=l;
-1==l.indexOf(".")&&(l=window[l]?l+e.counter++:l,window[l]=function(){
c="loaded",t.callback.apply(null,arguments);
}),y=y.replace("="+w,"="+l);
}
a.onload=a.onreadystatechange=function(){
var e=navigator.userAgent.toLowerCase();
(-1!=e.indexOf("opera")||-1==e.indexOf("msie")||/loaded|complete/i.test(this.readyState))&&("JS"==i&&(c="loaded"),
h("loaded"==c?u:f));
},a.onerror=function(){
return n>0?(t.retry=n-1,p&&(clearTimeout(p),p=null),void e(t)):void h(f);
},t.timeout&&(p=setTimeout(function(){
h(s);
},parseInt(t.timeout,10))),c="loading",a.charset="utf-8",setTimeout(function(){
a.src=y;
try{
d.insertBefore(a,d.lastChild);
}catch(e){}
},0);
}
return e;
});define("biz_wap/utils/ajax_load_js.js",["biz_wap/utils/ajax.js","biz_wap/utils/localstorage.js"],function(e){
"use strict";
function n(e){
var n=d(e.url,e.version),o=function(){},i=function(){};
if("function"==typeof e.onSuccess&&(o=e.onSuccess),"function"==typeof e.onError&&(i=e.onError),
c(e.win,n))return void o({
code:1,
queueIndex:0
});
if(e.useCache){
var a=u(e.url,e.version);
if(a&&t({
win:e.win,
funcStr:a,
useCache:!1,
url:e.url,
version:e.version
}),c(e.win,n))return void o({
code:2,
queueIndex:0
});
}
if(S.callbackQueue.push({
options:e,
onSuccess:o,
onError:i
}),"undefined"==typeof S.jsLoadState[n]&&(S.jsLoadState[n]=-1),-1==S.jsLoadState[n]){
var s=e.url;
s+=-1==s.indexOf("?")?"?"+S.customerParam+"="+e.version:"&"+S.customerParam+"="+e.version,
r({
originUrl:e.url,
version:e.version,
url:s,
key:n
});
}
}
function r(e){
S.jsLoadState[e.key]=1,w({
url:e.url,
notJoinUrl:!0,
timeout:1e4,
type:"POST",
dataType:"text",
noXRequestedWidthHeader:!0,
success:function(n){
if(1==S.jsLoadState[e.key]){
S.jsLoadState[e.key]=-1;
var r=!0;
r=n?t({
win:null,
funcStr:n,
useCache:!0,
url:e.originUrl,
version:e.version
}):!1,o(r?{
code:3,
type:"suc",
funcStr:n
}:{
code:51,
type:"err"
});
}
},
error:function(){
1==S.jsLoadState[e.key]&&(S.jsLoadState[e.key]=-1,o({
code:52,
type:"err"
}));
},
complete:function(){
1==S.jsLoadState[e.key]&&(S.jsLoadState[e.key]=-1,o({
code:53,
type:"err"
}));
}
});
}
function t(e){
var n=e.win||window,r=!0;
try{
n.eval(e.funcStr),r=!0;
}catch(t){
r=!1;
}
return r?(s({
url:e.url,
version:e.version,
win:n
}),e.useCache&&a(e.url,e.version,e.funcStr),!0):(l({
url:e.url,
version:e.version,
win:n
}),i(e.url),!1);
}
function o(e){
for(var n=0,r=S.callbackQueue.length;r>n;n++){
var o=S.callbackQueue[n],u=o.options,i=u.win,a=d(u.url,u.version);
"suc"==e.type?(e.funcStr&&!c(i,a)&&t({
win:i,
funcStr:e.funcStr,
useCache:!1,
url:u.url,
version:u.version
}),o.onSuccess({
code:e.code,
queueIndex:n
})):o.onError({
code:e.code,
queueIndex:n
});
}
S.callbackQueue=[];
}
function u(e,n){
var r=f(e),t=y.get(r);
if(!t)return null;
var o;
try{
o=JSON.parse(t);
}catch(u){}
if(o){
var a=+new Date,c=1*o.time;
return a-c>S.lsTimeout||o.version!=n||!o.func?(i(e),null):o.func;
}
}
function i(e){
var n=f(e);
y.remove(n);
}
function a(e,n,r){
var t={
version:n,
func:r,
time:+new Date
},o=f(e);
try{
y.set(o,JSON.stringify(t));
}catch(u){}
}
function c(e,n){
return e=e||window,e[S.winCacheKey]&&e[S.winCacheKey][n]&&e[S.winCacheKey][n].state===!0?!0:!1;
}
function s(e){
var n=d(e.url,e.version),r=e.win||window;
r[S.winCacheKey]||(r[S.winCacheKey]={}),r[S.winCacheKey][n]||(r[S.winCacheKey][n]={}),
r[S.winCacheKey][n].state=!0;
}
function l(e){
var n=d(e.url,e.version),r=e.win||window;
if(r[S.winCacheKey]&&r[S.winCacheKey][n])try{
delete r[S.winCacheKey][n];
}catch(t){}
}
function f(e){
return encodeURIComponent(e);
}
function d(e,n){
return encodeURIComponent(e)+"_"+n||"";
}
function v(e){
l(e),i(e.url);
}
var w=e("biz_wap/utils/ajax.js"),y=e("biz_wap/utils/localstorage.js"),S={
jsLoadState:{},
winCacheKey:"__loadExternalJsStates__",
lsTimeout:1728e5,
customerParam:"wxv",
callbackQueue:[]
};
return{
ClearCache:v,
Load:n
};
});define("appmsg/comment.js",["biz_common/dom/class.js","appmsg/cmt_tpl.html.js","biz_common/utils/wxgspeedsdk.js","appmsg/comment_report.js","biz_wap/utils/device.js","appmsg/retry_ajax.js","biz_common/dom/offset.js","biz_common/utils/url/parse.js","biz_wap/jsapi/core.js","common/utils.js","biz_common/utils/monitor.js","biz_common/dom/event.js","biz_wap/utils/ajax.js","biz_common/utils/string/html.js","biz_common/tmpl.js","biz_wap/utils/fakehash.js","appmsg/log.js","appmsg/comment_tpl.html.js","appmsg/friend_comment_tpl.html.js","appmsg/my_comment_tpl.html.js","appmsg/emotion/emotion.js","appmsg/emotion/dom.js"],function(e,t,n,o){
"use strict";
function m(e,t){
e&&(e.style.display=t?t:"block");
}
function i(e){
e&&(e.style.display="none");
}
function c(){
ft.mylist.children.length?(m(ft.mylist.parentNode),H.removeClass(document.body,mt)):(i(ft.mylist.parentNode),
H.addClass(document.body,mt));
}
function d(){
setTimeout(function(){
m(ft.toast);
},750),setTimeout(function(){
i(ft.toast);
},1500);
}
function s(e){
return e.replace(/^\s+|\s+$/g,"");
}
function l(e,t){
if(!(Math.random()<.999)){
var n=window.location.protocol,o=9;
"https:"==n&&(o=18),S.saveSpeeds({
uin:uin,
pid:o,
speeds:[{
sid:29,
time:e
},{
sid:30,
time:t
}]
}),S.send();
}
}
function a(e,t){
if("undefined"!=typeof e){
var n=new Image;
n.src=tt.idkey?"//mp.weixin.qq.com/mp/jsmonitor?idkey="+(tt.idkey+"_"+e+"_1")+"&t="+Math.random():"http://mp.weixin.qq.com/mp/jsreport?key="+e+"&content="+(t||"")+"&r="+Math.random();
}
}
function _(){
return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
}
function r(){
it||(it=!0,new A({
comment_id:Z,
appmsgid:appmsgid,
idx:idx,
item_show_type:window.item_show_type||0,
biz:biz
}));
}
function p(e){
e=e===!0,e&&(st=0);
var t=_(),n=document.documentElement.scrollHeight;
if(n<t+Q.getInnerHeight()+100&&$.off(window,"scroll",p),!(at||-1==st||st>0&&n-t-Q.getInnerHeight()>500)){
if("number"==typeof window.comment_count&&0==window.comment_count&&!e)return void u({
enabled:1,
elected_comment:[],
friend_comment:[],
elected_comment_total_cnt:0,
my_comment:[],
only_fans_can_comment:window.only_fans_can_comment,
is_fans:window._is_fans,
logo_url:window._logo_url,
nick_name:window._nick_name
});
var o=+new Date;
at=!0,i(ft.tips),m(ft.loading);
var c="/mp/appmsg_comment?action=getcomment&scene="+tt.scene+"&__biz="+biz+"&appmsgid="+appmsgid+"&idx="+idx+"&comment_id="+Z+"&offset="+st+"&limit="+lt+(window.send_time?"&send_time="+send_time:"");
try{
bt++,e&&(jt=[]),bt>1&&!e&&a(tt.moreList,encodeURIComponent(c)),jt.indexOf(c)>-1&&a(tt.repeatList,encodeURIComponent(c)),
jt.push(c);
}catch(d){}
!!R&&console.info("[图文评论] 开始请求评论数据:",c),et("[Appmsg comment] start get comment data, url:"+c),
G({
url:c,
type:"get",
success:function(t){
var n=+new Date,m=n-o,i={};
try{
i=window.eval.call(window,"("+t+")");
}catch(d){}
window.test_comment_data&&(i=window.test_comment_data);
var s=i.base_resp&&i.base_resp.ret;
if(0==s){
u(i,e);
var _=+new Date-n;
l(m,_);
}else a(tt.errList,"type:resperr;url:"+encodeURIComponent(c)+";ret="+s);
et("[Appmsg comment] get comment success"),r(),X||"5"!==window.item_show_type||(W.setAvg(112287,36,Date.now()-window.logs.pagetime.page_begin),
W.send(),X=!0);
},
error:function(){
a(tt.errList,"type:ajaxerr;url:"+encodeURIComponent(c)),et("[Appmsg comment] get comment ajax error");
},
complete:function(){
at=!1,i(ft.loading),$.off(window,"scroll",L);
}
});
}
}
function u(e,t){
var n,o,c=document.createDocumentFragment(),d=document.createDocumentFragment();
a(tt.handleList,encodeURIComponent(JSON.stringify({
comment_id:Z,
offset:st,
url:location.href
}))),"undefined"!=typeof e.only_fans_can_comment?window.can_fans_comment_only=e.only_fans_can_comment:"undefined"==typeof window.can_fans_comment_only&&(window.can_fans_comment_only=0),
1!=e.enabled?(O&&(O.style.display="none"),N&&i(N),e.elected_comment=[],e.friend_comment=[],
e.elected_comment_total_cnt=0,e.friend_comment_total_cnt=0):(O&&(O.style.display="block"),
N&&m(N)),0==st?(_t=e.logo_url,rt=e.nick_name,t&&(yt=[]),n=e.elected_comment,n&&n.length?(w(n,c,"elected"),
t&&(ft.list.innerHTML=""),ft.list.appendChild(c),m(ft.main),0==window.can_fans_comment_only||1==window.can_fans_comment_only&&1==e.is_fans?m(document.getElementById("js_cmt_addbtn1")):m(document.getElementById("js_cmt_nofans1"),"block"),
e.elected_comment_total_cnt<=10&&(m(document.getElementById("js_cmt_statement")),
m(document.getElementById("js_cmt_qa")))):(i(ft.main),0==window.can_fans_comment_only||1==window.can_fans_comment_only&&1==e.is_fans?m(document.getElementById("js_cmt_addbtn2")):m(document.getElementById("js_cmt_nofans2"),"block")),
o=e.friend_comment,w(o,d,"friend"),o&&0==o.length&&i(N),t&&(ft.fdlist.innerHTML=""),
ft.fdlist.appendChild(d),o&&o.length?(m(ft.fdmain),(0==window.can_fans_comment_only||1==window.can_fans_comment_only&&1==e.is_fans)&&(i(document.getElementById("js_cmt_addbtn1")),
i(document.getElementById("js_cmt_addbtn2")),m(document.getElementById("js_cmt_addbtn3")))):i(ft.fdmain),
e.friend_comment.length>0||e.elected_comment.length>0,function(){
var e=location.href.indexOf("scrolltodown")>-1?!0:!1,t=(document.getElementById("img-content"),
document.getElementById("js_cmt_area"));
if(e&&t&&t.offsetTop){
var n=t.offsetTop;
window.scrollTo(0,n-25);
}
}()):(n=e.elected_comment,n&&n.length&&(w(n,c,"elected"),ft.list.appendChild(c))),
0==e.elected_comment_total_cnt?(st=-1,i(document.getElementById("js_cmt_loading")),
i(document.getElementById("js_cmt_statement")),i(document.getElementById("js_cmt_qa"))):st+lt>=e.elected_comment_total_cnt?(st=-1,
i(document.getElementById("js_cmt_loading")),m(document.getElementById("js_cmt_statement")),
m(document.getElementById("js_cmt_qa"))):st+=e.elected_comment.length;
}
function g(){
dt.log("tag1");
var e=s(ft.input.value);
if(dt.log("tag2"),!H.hasClass(ft.submit,"btn_disabled")){
if(dt.log("tag3"),e.length<1)return b("留言不能为空");
if(dt.log("tag4"),e.length>600)return b("字数不能多于600个");
dt.log("tag5"),H.addClass(ft.submit,"btn_disabled"),dt.log("tag6");
var t=document.getElementById("activity-name");
dt.log("tag7"),ht!=e&&(It=+new Date);
var n=function(t){
{
var n=document.createDocumentFragment();
document.createDocumentFragment();
}
d(),console.log("------------------------",window.friend_comment_enabled),w([{
content:e,
nick_name:rt,
create_time:(new Date).getTime()/1e3|0,
is_elected:0,
logo_url:_t,
like_status:0,
like_num_format:0,
like_num:0,
is_from_friend:0,
is_from_me:1,
my_id:t.my_id,
content_id:t.content_id
}],n,"mine"),ft.mylist.insertBefore(n,ft.mylist.firstChild);
c(),ft.input.value="",z();
};
if(window.test_comment_data)return void n({
my_id:"111"
});
var o="/mp/appmsg_comment?action=addcomment&scene="+tt.scene+"&comment_id="+Z+"&__biz="+biz+"&idx="+idx+"&appmsgid="+appmsgid+"&sn="+sn;
G({
url:o,
data:{
content:e,
title:t&&s(t.innerText),
head_img:_t,
nickname:rt,
client_id:It
},
type:"POST",
success:function(t){
dt.log("tag8"),ct.hidePannel();
var m={};
try{
m=window.eval.call(window,"("+t+")");
}catch(i){}
switch(+m.ret){
case 0:
n(m);
break;

case-6:
b("你留言的太频繁了，休息一下吧");
break;

case-7:
b("你还未关注该公众号，不能参与留言");
break;

case-10:
b("字数不能多于600个");
break;

case-15:
b("留言已关闭");
break;

default:
ht=e,b("系统错误，请重试");
}
0!=m.ret&&a(tt.addCommentErr,"type:resperr;url:"+encodeURIComponent(o)+";ret="+m.ret);
},
error:function(e){
dt.log("shit;"+e.status+";"+e.statusText),a(tt.addCommentErr,"type:ajaxerr;url:"+encodeURIComponent(o));
},
complete:function(){
""!=ft.input.value&&H.removeClass(ft.submit,"btn_disabled");
}
});
}
}
function f(){
if(c(),0==pt){
var e="/mp/appmsg_comment?action=getmycomment&scene="+tt.scene+"&__biz="+biz+"&appmsgid="+appmsgid+"&idx="+idx+"&comment_id="+Z,t=document.getElementById("js_mycmt_loading");
pt=1,m(t),G({
url:e,
type:"get",
success:function(t){
var n={};
try{
n=window.eval.call(window,"("+t+")");
}catch(o){}
var m=n.base_resp&&n.base_resp.ret;
if(0==m){
var i=n.my_comment,c=document.createDocumentFragment();
i&&i.length&&(w(i,c,"mine"),ft.mylist.appendChild(c)),pt=2;
}else pt=0,a(tt.errComment,"type:resperr;url:"+encodeURIComponent(e)+";ret="+m);
},
error:function(){
pt=0,a(tt.errComment,"type:ajaxerr;url:"+encodeURIComponent(e));
},
complete:function(){
i(t),c();
}
});
}
}
function y(e){
var t=(new Date).getTime(),n=new Date;
n.setDate(n.getDate()+1),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n=n.getTime();
var o=t/1e3-e,m=n/1e3-e,i=new Date(n).getFullYear(),c=new Date(1e3*e);
return 3600>o?Math.ceil(o/60)+"分钟前":86400>m?Math.floor(o/60/60)+"小时前":172800>m?"昨天":604800>m?Math.floor(m/24/60/60)+"天前":c.getFullYear()==i?c.getMonth()+1+"月"+c.getDate()+"日":c.getFullYear()+"年"+(c.getMonth()+1)+"月"+c.getDate()+"日";
}
function w(e,t,n){
var o,m="",i=document.createElement("div"),c="http://mmbiz.qpic.cn/mmbiz/ByCS3p9sHiak6fjSeA7cianwo25C0CIt5ib8nAcZjW7QT1ZEmUo4r5iazzAKhuQibEXOReDGmXzj8rNg/0",d="";
"elected"==n?d=0:"friend"==n&&(d=1),wt={};
for(var s,l=0;s=e[l];++l){
s.time=y(s.create_time),s.status="",s.logo_url=s.logo_url||c,s.logo_url=-1!=s.logo_url.indexOf("wx.qlogo.cn")?s.logo_url.replace(/\/132$/,"/96"):s.logo_url,
s.content=s.content.htmlDecodeLite().htmlEncodeLite(),s.nick_name=s.nick_name.htmlDecodeLite().htmlEncodeLite(),
s.like_num_format=parseInt(s.like_num)>=1e4?(s.like_num/1e4).toFixed(1)+"万":s.like_num,
s.is_from_friend="friend"==n?0:s.is_from_friend||0,s.is_from_me="mine"==n?1:s.is_from_me||0,
s.reply=s.reply||{
reply_list:[]
},s.is_mine=n?!1:!0,s.is_elected="elected"==n||"friend"==n?1:s.is_elected,s.is_top="friend"==n?0:s.is_top,
s.report_elected=s.is_elected||0,s.report_friend=s.is_from_friend||0,s.scene=d,s.reply.reply_list.length>0&&(s.reply.reply_list[0].time=y(s.reply.reply_list[0].create_time),
s.reply.reply_list[0].content=(s.reply.reply_list[0].content||"").htmlEncodeLite(),
s.reply.reply_list[0].reply_like_status=s.reply.reply_list[0].reply_like_status||0,
s.reply.reply_list[0].reply_like_num=s.reply.reply_list[0].reply_like_num||0,s.reply.reply_list[0].reply_like_num_format=parseInt(s.reply.reply_list[0].reply_like_num)>=1e4?(s.reply.reply_list[0].reply_like_num/1e4).toFixed(1)+"万":s.reply.reply_list[0].reply_like_num),
s.new_appmsg=window.new_appmsg,m+=K.tmpl(q,s);
try{
var _=s.nick_name+s.content,r=!1,p=tt.repeatContentID;
wt[_]&&(r=!0,p=tt.repeatContent),yt.indexOf(s.content_id)>-1&&(r=!0,p=tt.repeatContentID),
yt.push(s.content_id),wt[_]=!0,r&&a(p,encodeURIComponent(JSON.stringify({
comment_id:Z,
content_id:s.content_id,
offset:st,
length:e.length,
url:location.href
})));
}catch(u){}
}
for(i.innerHTML=m,j(i);o=i.children.item(0);)t.appendChild(o);
}
function j(e){
dt.each(e.querySelectorAll("div.discuss_message_content"),function(e){
e.innerHTML=ct.encode(e.innerHTML);
});
}
function b(e){
return setTimeout(function(){
o(e);
});
}
function h(){
var e="1"===Y.getQuery("js_my_comment");
e&&k(!0);
}
function I(){
var e=document.getElementById("activity-name");
return Q.isNativePage()?(J.invoke("handleMPPageAction",{
action:"writeComment",
title:e&&s(e.innerText),
comment_id:Z,
style:"8"===item_show_type||"5"===item_show_type?"black":"white"
}),!0):void 0;
}
function k(e){
nt=_(),i(ft.article),m(ft.mine),window.__second_open__&&F.os.ios&&m(ft.fakebar),
window.scrollTo(0,0),f(),e||dt.later(function(){
ft.input.focus();
});
}
function v(){
i(ft.mine),m(ft.article),console.log(nt),window.scrollTo(0,nt),ft.input.blur(),H.removeClass(document.body,ot),
H.removeClass(document.body,mt),Q.isNativePage()||"5"!==window.item_show_type||(J.invoke("setNavigationBarColor",{
color:"#1f1f1f"
}),J.invoke("setBounceBackground",{
backgroundColor:"#1f1f1f"
}));
}
function E(e){
var t=e.delegatedTarget||e.srcElement,n=null;
if(H.hasClass(t,"js_comment_praise")&&(n=t),n){
for(var o=parseInt(n.dataset.status),m=0==o?1:0,i=n.dataset.contentId,c=n.dataset.scene,d=document.querySelectorAll('.js_comment_praise[data-content-id="'+i+'"]'),s=0;s<d.length;s++)C(d[s]);
if(window.test_comment_data)return;
U({
url:"/mp/appmsg_comment?action=likecomment",
type:"POST",
data:{
like:m,
__biz:biz,
appmsgid:appmsgid,
comment_id:Z,
content_id:i,
item_show_type:window.item_show_type||0,
scene:c
}
});
}
}
function B(e){
for(var t=e.delegatedTarget,n=parseInt(t.dataset.status),o=n?0:1,m=t.dataset.contentId,i=t.dataset.replyId,c=t.dataset.scene,d=document.querySelectorAll('.js_reply_praise[data-content-id="'+m+'"]'),s=0;s<d.length;s++)C(d[s]);
document.querySelector("meta[name=viewport]"),window.test_comment_data||G({
url:"/mp/appmsg_comment?action=like_author_reply",
type:"post",
data:{
__biz:biz,
comment_id:Z,
content_id:m,
reply_id:i,
like:o,
scene:c,
item_show_type:window.item_show_type||0
}
});
}
function C(e){
var t=H.hasClass(e,"praised"),n=e.querySelector(".praise_num"),o=n.innerHTML,m=o.indexOf("万"),i=parseInt(o)?parseInt(o):0;
t?(-1==m&&(n.innerHTML=i-1>0?i-1:""),H.removeClass(e,"praised"),e.dataset.status=0):(-1==m&&(n.innerHTML=i+1),
H.addClass(e,"praised"),e.dataset.status=1);
}
function z(){
ft.list.children.length?ft.fdlist.children.length?(m(document.getElementById("js_cmt_addbtn3")),
i(document.getElementById("js_cmt_addbtn1")),i(document.getElementById("js_cmt_addbtn2")),
i(document.getElementById("js_cmt_addbtn4"))):(m(document.getElementById("js_cmt_addbtn1")),
i(document.getElementById("js_cmt_addbtn2")),i(document.getElementById("js_cmt_addbtn3")),
i(document.getElementById("js_cmt_addbtn4"))):ft.fdlist.children.length?(m(document.getElementById("js_cmt_addbtn3")),
i(document.getElementById("js_cmt_addbtn4")),i(document.getElementById("js_cmt_addbtn1")),
i(document.getElementById("js_cmt_addbtn2"))):(m(document.getElementById("js_cmt_addbtn2")),
i(document.getElementById("js_cmt_addbtn3")),i(document.getElementById("js_cmt_addbtn1")),
i(document.getElementById("js_cmt_addbtn4")));
}
function D(e,t){
e.parentNode.removeChild(e);
for(var n=document.querySelectorAll(".cid"+t),o=0;o<n.length;o++)n[o].parentNode.removeChild(n[o]);
ft.list.children.length?ft.fdlist.children.length||i(ft.fdmain):(i(ft.main),i(document.getElementById("js_cmt_statement")),
i(document.getElementById("js_cmt_qa")),ft.fdlist.children.length||i(ft.fdmain)),
c(),z();
}
function T(e){
var t=e.delegatedTarget,n=t.getAttribute("data-my-id"),m="/mp/appmsg_comment?action=delete&scene="+tt.scene+"&__biz="+biz+"&appmsgid="+appmsgid+"&comment_id="+Z+"&my_id="+n;
confirm("确定删除吗？")&&G({
url:m,
success:function(e){
var m=t;
try{
e=JSON.parse(e);
}catch(i){
e={};
}
if(0==e.ret){
for(;m&&(m.nodeType!=m.ELEMENT_NODE||"li"!=m.tagName.toLowerCase());)m=m.parentNode;
m&&D(m,n);
}else o("删除失败，请重试");
},
error:function(){
o("网络错误，请重试");
}
});
}
function x(e){
e&&e.preventDefault(),v(),i(ft.fakebar);
}
function L(){
try{
var e=ft.loading.getBoundingClientRect(),t=Math.random()<1;
e.top<Q.getInnerHeight()&&at&&t&&((new Image).src="//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_45_1&lc=1&log0",
$.off(window,"scroll",L));
}catch(n){}
}
function M(e,t){
if(!I()){
if(Q.isNativePage()||"5"!==window.item_show_type||(H.addClass(document.body,ot),
J.invoke("setNavigationBarColor",{
color:"#191919"
}),J.invoke("setBounceBackground",{
backgroundColor:"#191919"
})),t)return!!R&&console.log("FakeHash on comment"),void k();
e.preventDefault(),window.__second_open__&&F.os.ios?k():(!!R&&console.log("push comment"),
V.push("comment"));
}
}
var H=e("biz_common/dom/class.js"),q=e("appmsg/cmt_tpl.html.js"),O=document.getElementById("js_cmt_area"),N=document.getElementById("js_friend_cmt_area"),S=e("biz_common/utils/wxgspeedsdk.js"),A=e("appmsg/comment_report.js"),R=location.href.indexOf("vconsole=1")>0||document.cookie&&document.cookie.indexOf("vconsole_open=1")>-1?!0:!1,F=e("biz_wap/utils/device.js"),U=e("appmsg/retry_ajax.js"),P=e("biz_common/dom/offset.js"),Y=e("biz_common/utils/url/parse.js"),J=e("biz_wap/jsapi/core.js"),Q=e("common/utils.js"),W=e("biz_common/utils/monitor.js"),X=void 0,Z=0;
if(window._has_comment=!0,"undefined"!=typeof window.comment_id?Z=window.comment_id:window.cgiData&&"undefined"!=typeof window.cgiData.comment_id&&(Z=window.cgiData.comment_id),
!!R&&console.info("[图文评论] 评论ID:",Z),-1!=navigator.userAgent.indexOf("MicroMessenger")||window.test_comment_data||(O&&(O.style.display="none"),
N&&(N.style.display="none"),Z=0,window._has_comment=!1),0==Z)return void(window._has_comment=!1);
var $=e("biz_common/dom/event.js"),G=e("biz_wap/utils/ajax.js"),K=(e("biz_common/utils/string/html.js"),
e("biz_common/tmpl.js")),V=e("biz_wap/utils/fakehash.js"),et=e("appmsg/log.js"),tt={
scene:0,
idkey:"",
moreList:27,
repeatList:25,
errList:18,
handleList:26,
addCommentErr:19,
errComment:18,
repeatContent:24,
repeatContentID:23
},nt=null,ot="comment_editing",mt="my_comment_empty_data";
window.__commentReportData&&window.__commentReportData.idkey&&(!!R&&console.log("init reportData"),
tt=window.__commentReportData),function(){
if(O){
var t=e("appmsg/comment_tpl.html.js");
O.innerHTML=K.tmpl(t,{
new_appmsg:window.new_appmsg
});
}
if(N){
var n=e("appmsg/friend_comment_tpl.html.js");
N.innerHTML=K.tmpl(n,{
new_appmsg:window.new_appmsg
});
}
}(),function(){
var t=e("appmsg/my_comment_tpl.html.js"),n=document.createElement("div");
n.innerHTML=K.tmpl(t,{
new_appmsg:window.new_appmsg,
friend_comment_enabled:window.friend_comment_enabled,
isIos:F.os.ios
}),document.body.appendChild(n);
}();
var it,ct=e("appmsg/emotion/emotion.js"),dt=e("appmsg/emotion/dom.js"),st=(new Image,
0),lt=100,at=!1,_t="",rt="我",pt=0,ut=!1,gt=["“”","‘’","（）","《》","〈〉","「」","『』","〔〕","【】","［］","[]","｛｝","{}","()","<>"],ft={
article:document.getElementById("js_article"),
mine:document.getElementById("js_cmt_mine"),
main:document.getElementById("js_cmt_main"),
input:document.getElementById("js_cmt_input"),
submit:document.getElementById("js_cmt_submit"),
goback:document.getElementById("js_cmt_goback"),
addbtn:document.getElementById("js_cmt_addbtn"),
list:document.getElementById("js_cmt_list"),
mylist:document.getElementById("js_cmt_mylist"),
morelist:document.getElementById("js_cmt_morelist"),
toast:document.getElementById("js_cmt_toast"),
tips:document.getElementById("js_cmt_tips"),
loading:document.getElementById("js_cmt_loading"),
fdmain:document.getElementById("js_friend_cmt_main"),
fdlist:document.getElementById("js_friend_cmt_list"),
fdlisthide:document.getElementById("js_friend_cmt_list_hide"),
morefdlist:document.getElementById("js_more_friend_cmt_area"),
morefd:document.getElementById("js_more_friend_cmt"),
fakebar:document.getElementById("js_fake_bar"),
cmtContainer:document.getElementById("js_cmt_container")
},yt=[],wt={},jt=(new Image,[]),bt=0,ht=null,It=+new Date;
if(window.__second_open__&&F.os.ios&&(ft.mine.style.marginBottom=getComputedStyle(ft.fakebar).height),
function(){
p(),h(),ct.init();
}(),V.on("comment",function(){
M(null,!0);
}),V.on("article",function(){
!!R&&console.log("FakeHash on article"),v();
}),V.on(function(e){
"comment"==e&&v();
}),$.on(ft.input,"input",function(e){
var t=s(ft.input.value);
t.length<1?H.addClass(ft.submit,"btn_disabled"):H.removeClass(ft.submit,"btn_disabled"),
F.os.ios&&e.data&&gt.indexOf(e.data)>-1&&(ut=!0);
}),$.on(ft.input,"click",function(){
F.os.ios&&ut&&(ft.input.blur(),ft.input.focus(),ut=!1);
}),$.on(ft.list,"click",".js_comment_praise",E),$.on(ft.mylist,"click",".js_comment_praise",E),
$.on(ft.fdlist,"click",".js_comment_praise",E),$.on(ft.list,"click",".js_reply_praise",B),
$.on(ft.fdlist,"click",".js_reply_praise",B),$.on(ft.list,"click",".js_del",T),$.on(ft.mylist,"click",".js_del",T),
$.on(ft.fdlist,"click",".js_del",T),Q.listenMpPageAction(function(e){
"deleteComment"===e.action&&D(document.getElementById("cid"+e.personal_comment_id),e.personal_comment_id);
}),$.on(ft.list,"click",".js_del",function(e){
e.preventDefault();
}),$.on(ft.mylist,"click",".js_del",function(e){
e.preventDefault();
}),$.on(ft.fdlist,"click",".js_del",function(e){
e.preventDefault();
}),$.on(ft.submit,"click",g),$.on(ft.submit,"click",function(e){
e.preventDefault();
}),ft.goback&&($.on(ft.goback,"click",x),$.on(ft.goback,"click",x)),window.__second_open__&&F.os.ios){
$.on(ft.input,"click",function(){
i(ft.fakebar);
}),$.on(ft.input,"blur",function(){
console.log("input blur"),"none"!=ft.mine.style.display&&m(ft.fakebar);
});
var kt=null,vt=null;
$.on(window,"orientationchange",function(){
"none"!==ft.fakebar.style.display&&(clearTimeout(kt),kt=setTimeout(function(){
window.innerWidth!==parseFloat(getComputedStyle(ft.fakebar).width)&&(clearTimeout(vt),
ft.mine.style.height=Q.getInnerHeight()+"px",window.scrollBy&&window.scrollBy(0,1),
vt=setTimeout(function(){
window.scrollBy&&window.scrollBy(0,-1),ft.mine.style.height="";
},100));
},50));
});
}
$.on(window,"scroll",p),$.on(window,"scroll",L),$.on(document.getElementById("js_cmt_write1"),"click",function(e){
M(e);
}),$.on(document.getElementById("js_cmt_write2"),"click",function(e){
M(e);
}),$.on(document.getElementById("js_cmt_write3"),"click",function(e){
M(e);
}),$.on(document.getElementById("js_cmt_write4"),"click",function(e){
M(e);
}),$.bindVisibilityChangeEvt(function(e){
e&&_()<P.getOffset(ft.cmtContainer).offsetTop-Q.getInnerHeight()&&p(!0);
});
});function _typeof(e){
return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e;
}
define("appmsg/reward_entry.js",["biz_common/dom/event.js","biz_wap/utils/ajax.js","biz_wap/jsapi/core.js","rt/appmsg/getappmsgext.rt.js","biz_wap/utils/mmversion.js","appmsg/appmsgext.js","appmsg/open_url_with_webview.js","common/utils.js"],function(e,t,a,r){
"use strict";
function n(e){
e&&(e.style.display="block");
}
function d(e){
e&&(e.style.display="none");
}
function i(){
v.getData({
biz:biz,
appmsg_type:appmsg_type,
mid:mid,
sn:sn,
idx:idx,
pass_ticket:window.pass_ticket,
scene:k.scene,
title:k.title,
ct:ct,
devicetype:k.devicetype,
version:k.version,
is_need_reward:k.is_need_reward,
reward_uin_count:k.is_need_reward?3*u:0,
send_time:k.send_time||"",
item_show_type:window.item_show_type||"",
rtId:k.appmsgextRtId,
rtKey:k.appmsgextRtKey,
onSuccess:function(e){
e&&(b.rewardLink&&m.off(b.rewardLink,"click",T),b.authorAvatarLink&&m.off(b.authorAvatarLink,"click",z),
console.log("reloadRewardData:",e),B=[],s({
reward_total:e.reward_total_count,
reward_head_imgs:e.reward_head_imgs||[],
can_reward:e.can_reward,
timestamp:e.timestamp,
reward_author_head:e.reward_author_head,
rewardsn:e.rewardsn
}));
},
onError:function(){}
});
}
function o(e,t){
var a=function(){
R.src=t+"&qrcode_timestamp="+1*new Date+"#wechat_redirect";
},n=null;
return function(t){
if("0"==k.user_can_reward)return void r("你已成为该公众号的黑名单用户，暂时无法赞赏。");
if(t.preventDefault(),k.isWindowsWechat){
var d=function(){
var e="js_author_reward_qrcode",t="reward_pop_show",r=document.getElementById(e);
if(r.classList.contains(t))return{
v:void 0
};
a(),n=setInterval(a,12e4),r.classList[b.rewardLink.getBoundingClientRect().top<222?"add":"remove"]("reward_pop_bottom"),
r.classList.add(t);
var d=function i(a){
if(r.classList.contains(t)){
for(var d=a.target;null!==d&&d.id!==e;)d=d.parentNode;
(null===d||d.id!==e)&&(r.classList.remove(t),clearInterval(n),n=null,m.off(window,"click",i));
}
};
setTimeout(function(){
m.on(window,"click",d);
},1);
}();
if("object"===("undefined"==typeof d?"undefined":_typeof(d)))return d.v;
}else-1==e.indexOf("&__tc=1")&&window.__addIdKeyReport?window.__addIdKeyReport(k.likeHeadId,k.likeHeadKey):window.__addIdKeyReport&&window.__addIdKeyReport(k.likeBtnId,k.likeBtnKey),
g.invoke("openUrlWithExtraWebview",{
url:e,
openType:1
},function(t){
t.err_msg.indexOf(":ok")>-1||(location.href=e);
});
};
}
function s(e){
var t=window.innerWidth||document.documentElement.innerWidth,a=(Math.ceil((x.getInnerHeight()-188)/42)+1)*Math.floor((t-15)/42);
p="http://mp.weixin.qq.com/mp/reward?act=getrewardheads&__biz="+biz+"&appmsgid="+mid+"&idx="+idx+"&sn="+sn+"&offset=0&count="+a+"&source=1#wechat_redirect";
var r="#wechat_redirect",s="";
s="https://mp.weixin.qq.com/mp/author?action=show&__biz="+biz+"&appmsgid="+mid+"&timestamp="+e.timestamp+"&author_id="+k.author_id+"&idx="+idx+"&scene="+k.authorPageScene+"&rscene="+k.authorPageRscene,
e.rewardsn&&(s+="&rewardsn="+e.rewardsn),s+=r,-1==navigator.userAgent.indexOf("Android")||k.author_id||(s="https://mp.weixin.qq.com/bizmall/reward?act=showpage&__biz="+biz+"&appmsgid="+mid+"&idx="+idx+"&sn="+sn+"&timestamp="+e.timestamp+"&showwxpaytitle=1&rewardsn="+e.rewardsn+r);
var w=b.rewardLink,v=b.authorAvatarLink;
if(w){
g.on("activity:state_change",function(e){
if("onResume"==e.state_change||"onResume"==e.state){
var t=(new Date).valueOf();
if(-1!=navigator.userAgent.indexOf("Android")&&localStorage.getItem("lastOnresumeTime")&&t-parseInt(localStorage.getItem("lastOnresumeTime"))<=j)return;
localStorage.setItem("lastOnresumeTime",t),h.isAndroid&&!k.author_id&&g.invoke("setNavigationBarColor",{
actionCode:"1"
}),i();
}
});
var R="/mp/authorreward?action=getqrcode&author_id="+k.author_id+"&rewardsn="+e.rewardsn+"&timestamp="+e.timestamp+"&__biz="+biz+"&appmsgid="+mid+"&idx="+idx+"&size=160";
if(T=o(s.replace(r,"&__tc=1"+r),R),z=o(s,R),m.on(w,"click",T),k.author_id&&1==e.can_reward&&v&&m.on(v,"click",z),
1==e.can_reward&&k.author_id&&b.reward){
n(document.getElementById("js_reward_author")),n(b.authorAvatarLink),b.rewardAuthorHead&&b.rewardAuthorHead.setAttribute("src",e.reward_author_head),
b.reward.classList.add("reward_area_primary");
var H=b.rewardLinkText;
H&&(H.innerText="喜欢作者",Math.random()<.05?H.innerText="稀罕作者":Math.random()>.05&&Math.random()<.1&&(H.innerText="钟意作者")),
b.rewardTotalText&&(b.rewardTotalText.innerText="人喜欢"),k.isWindowsWechat&&b.reward.classList.add("reward_area_win");
}
}
I=e.reward_head_imgs;
var A=c();
b.reward&&(k.author_id||h.isAndroid)&&1==e.can_reward?(n(b.reward),m.on(window,"load",function(){
_&&(m.off(window,"scroll",_),m.on(window,"scroll",_));
})):d(b.reward);
var K=document.getElementById("js_reward_inner");
K&&A>0&&n(K);
var S=[].concat(I),M=document.getElementById("js_reward_total");
if(E=16*u,B=[].concat(I),M)if(M.innerText=e.reward_total,k.isWindowsWechat){
var W=M.parentNode;
W.dataset.hasEvent||!function(){
var t=document.getElementById("js_reward_pagination"),a=t.getElementsByClassName("js_reward_pagination_curpage")[0],r=Math.ceil(e.reward_total/E),n=1,d=!0,i=document.getElementById("js_reward_list"),o=function(t,a){
for(var n=(t-1)*E,o=d?3*u:0,s=document.createDocumentFragment(),c=n+o,_=t===r?e.reward_total:t*E;_>c;c++)l(s,a?window.defaultAvatarUrl:B[c]);
return!d&&(i.innerHTML=""),i.appendChild(s),d=!1,a?function(){
for(var e=i.getElementsByClassName("reward_user_avatar"),t=o,a=e.length;a>t;t++)e[t].firstElementChild.src=B[n+t];
}:!1;
};
a.innerHTML=n,t.getElementsByClassName("js_reward_pagination_totalpage")[0].innerHTML=r;
var s="/mp/reward?act=getrewardheads&__biz="+biz+"&appmsgid="+mid+"&idx="+idx+"&sn="+sn+"&count="+E,c=null,_=function(t){
var a=B.length;
e.reward_total>a&&t*E>a?(c=null,c=o(t,!0),f({
url:s+"&offset="+(t-1)*E+"#wechat_redirect",
type:"GET",
success:function(e){
try{
e=JSON.parse(e),e.reward_heads=JSON.parse(e.reward_heads).reward_heads;
}catch(t){
e={};
}
e.base_resp&&0===e.base_resp.ret&&(e.reward_heads.forEach(function(e){
var t=S.indexOf(e);
t>-1?S.splice(t,1):B.push(e);
}),"function"==typeof c&&c());
}
})):o(t);
};
A<e.reward_total&&!function(){
b.reward.classList.add("reward_avatar_overflow");
for(var o=i.children[0];1!==o.nodeType;)o=reward.nextElementSibling;
var s=getComputedStyle(o),l=o.offsetHeight+parseInt(s.marginBottom)+parseInt(s.marginTop);
L=function(t){
i.style.height="fold"===t?3*l+"px":r>n?l*Math.ceil(E/u)+"px":l*Math.ceil(e.reward_total%E/u)+"px";
},L("fold"),m.on(W,"click",function(){
b.reward.classList.contains("reward_avatar_unfold")?(b.reward.classList.remove("reward_avatar_unfold"),
r>1&&(t.style.display="none"),L("fold")):(1===n&&d&&_(n),b.reward.classList.add("reward_avatar_unfold"),
r>1&&(t.style.display=""),L("unfold"));
}),r>1&&m.on(t,"click",function(e){
var t=e.target;
if(t.classList.contains("js_reward_pagination_prev")){
if(n--,a.innerHTML=n,_(n),1===n&&(t.disabled=!0),n===r-1){
for(;t&&!t.classList.contains("js_reward_pagination_next");)t=t.nextElementSibling;
t&&(t.disabled=!1),L("unfold");
}
}else if(t.classList.contains("js_reward_pagination_next")&&(n++,a.innerHTML=n,_(n),
n===r&&(t.disabled=!0,L("unfold")),2===n)){
for(;t&&!t.classList.contains("js_reward_pagination_prev");)t=t.previousElementSibling;
t&&(t.disabled=!1);
}
});
}(),W.dataset.hasEvent=1;
}();
}else M.setAttribute("data-href",p),M.getAttribute("data-hasevent")||(m.on(M,"click",function(){
var e=M.getAttribute("data-href");
return y(e,{
sample:1,
reject:function(){
location.href=e;
}
}),!1;
}),M.setAttribute("data-hasevent",1));
}
function l(e,t){
var a=document.createElement("span");
a.className="reward_user_avatar";
var r=new Image;
return r.onload=function(){
window.logs&&window.logs.reward_heads_total++,r.onload=r.onerror=null;
},r.onerror=function(){
window.logs&&window.logs.reward_heads_total++,window.logs&&window.logs.reward_heads_fail++,
r.onload=r.onerror=null;
},r.src=t,a.appendChild(r),e.appendChild(a),a;
}
function c(e){
var t=B.length?B:I;
if(t.length){
var a=document.getElementById("js_reward_list"),r=0,n=document.createDocumentFragment();
if(a){
var d=b.reward.classList.contains("reward_avatar_unfold");
if("function"==typeof L&&L(d?"unfold":"fold"),!e){
for(var i=0,o=t.length;o>i&&(r++,l(n,t[i]),d||r!==3*u)&&r!==(E||16*u);++i);
r>u&&(a.className+=" tl"),a.innerHTML="",a.appendChild(n);
}
}
return r;
}
}
function _(){
if(b.reward){
var e=window.pageYOffset||document.documentElement.scrollTop;
e+x.getInnerHeight()>b.reward.offsetTop&&(f({
type:"GET",
url:"/bizmall/reward?act=report&__biz="+biz+"&appmsgid="+mid+"&idx="+idx,
async:!0
}),m.off(window,"scroll",_),_=null);
}
}
function w(e){
"undefined"!=typeof e.scene&&(k.scene=e.scene),"undefined"!=typeof e.is_need_reward&&(k.is_need_reward=e.is_need_reward),
"undefined"!=typeof e.title&&(k.title=e.title),"undefined"!=typeof e.author_id&&(k.author_id=e.author_id),
"undefined"!=typeof e.user_can_reward&&(k.user_can_reward=e.user_can_reward),"undefined"!=typeof e.appmsgextRtId&&(k.appmsgextRtId=e.appmsgextRtId),
"undefined"!=typeof e.appmsgextRtKey&&(k.appmsgextRtKey=e.appmsgextRtKey),"undefined"!=typeof e.likeHeadId&&(k.likeHeadId=e.likeHeadId),
"undefined"!=typeof e.likeHeadKey&&(k.likeHeadKey=e.likeHeadKey),"undefined"!=typeof e.likeBtnId&&(k.likeBtnId=e.likeBtnId),
"undefined"!=typeof e.likeBtnKey&&(k.likeBtnKey=e.likeBtnKey),"undefined"!=typeof e.authorPageScene&&(k.authorPageScene=e.authorPageScene),
"undefined"!=typeof e.authorPageRscene&&(k.authorPageRscene=e.authorPageRscene),
"undefined"!=typeof e.devicetype&&(k.devicetype=e.devicetype),"undefined"!=typeof e.version&&(k.version=e.version),
"undefined"!=typeof e.send_time&&(k.send_time=e.send_time);
}
var u,p,m=e("biz_common/dom/event.js"),f=e("biz_wap/utils/ajax.js"),g=e("biz_wap/jsapi/core.js"),h=(e("rt/appmsg/getappmsgext.rt.js"),
e("biz_wap/utils/mmversion.js")),v=e("appmsg/appmsgext.js"),y=e("appmsg/open_url_with_webview.js"),x=e("common/utils.js"),k={
scene:window.source||"",
is_need_reward:!1,
title:window.msg_title||"",
author_id:window.author_id||"",
user_can_reward:!0,
appmsgextRtId:"",
appmsgextRtKey:"",
likeHeadId:"110809",
likeHeadKey:"2",
likeBtnId:"110809",
likeBtnKey:"3",
authorPageScene:"142",
authorPageRscene:"128",
devicetype:window.devicetype||"",
version:window.version||"",
send_time:window.send_time||"",
isWindowsWechat:-1!==window.navigator.userAgent.indexOf("WindowsWechat")
},b={
reward:document.getElementById("js_reward_area"),
rewardLink:document.getElementById("js_reward_link"),
authorAvatarLink:document.getElementById("js_reward_avatar"),
rewardAuthorHead:document.getElementById("js_reward_author_head"),
rewardLinkText:document.getElementById("js_reward_link_text"),
rewardTotalText:document.getElementById("js_reward_total_text")
},I=[],j=500,L=null,E=0,B=[];
window.logs&&(window.logs.reward_heads_total=0,window.logs.reward_heads_fail=0);
var T=function(){},z=function(){},R=document.getElementById("js_author_reward_qrcode_img");
return{
handle:function(e,t){
u=t,w(e),s(e);
},
render:function(e){
u=e,c(!0);
}
};
});define("a/ios.js",["biz_common/dom/event.js","biz_common/utils/report.js","biz_wap/utils/ajax.js","biz_wap/utils/openUrl.js","biz_wap/jsapi/core.js"],function(e){
"use strict";
function t(e){
"undefined"!=typeof WeixinJSBridge&&WeixinJSBridge.log&&WeixinJSBridge.log(e);
}
function i(e,t){
n("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+e+t.report_param);
}
function o(e){
var o=e.btn;
if(!o)return!1;
var n=e.adData,c=!1,d={};
e.report_param=e.report_param||"";
var s="http://"+location.host+"/mp/ad_redirect?url="+encodeURIComponent(n.appinfo_url)+"&ticket="+(e.ticket||window.ticket)+"#wechat_redirect";
r.on(o,"click",function(){
if(t("click @js_app_action"),c)return t("is_app_installed"),i(n.is_appmsg?17:13,e),
void p(n.app_id+"://");
var o=function(){
t("download"),i(n.is_appmsg?15:11,e),t("go : "+s),p(s);
};
return t("download"),n.rl&&n.traceid?d[n.traceid]||(d[n.traceid]=!0,a({
url:"/mp/advertisement_report?report_type=2&type="+n.type+"&url="+encodeURIComponent(n.appinfo_url)+"&ascene="+encodeURIComponent(window.ascene||-1)+"&tid="+n.traceid+"&rl="+encodeURIComponent(n.rl)+"&pt="+n.pt+e.report_param,
type:"GET",
timeout:1e3,
complete:function(){
t("ready to download"),d[n.traceid]=!1,o();
},
async:!0
})):o(),!1;
});
}
{
var r=e("biz_common/dom/event.js"),n=e("biz_common/utils/report.js"),a=e("biz_wap/utils/ajax.js"),p=e("biz_wap/utils/openUrl.js").openUrlWithExtraWebview;
e("biz_wap/jsapi/core.js");
}
return o;
});define("a/android.js",["biz_common/dom/event.js","biz_common/utils/report.js","biz_wap/utils/ajax.js","biz_wap/jsapi/core.js","biz_wap/utils/openUrl.js"],function(n,e,a,t){
"use strict";
function o(n){
"undefined"!=typeof s&&s.log&&s.log(n);
}
function i(n,e){
l("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+n+e.report_param);
}
function d(n){
function e(){
s.invoke("getInstallState",{
packageName:c.pkgname
},function(n){
var e=n.err_msg;
e.indexOf("get_install_state:yes")>-1&&(window.clearInterval(x),k=!0,d.innerHTML=T.installed);
});
}
function a(){
j&&s.invoke("queryDownloadTask",{
download_id:j
},function(e){
if(e&&e.state){
if("download_succ"==e.state){
o("download_succ"),i(c.is_appmsg?18:14,n),window.clearInterval(y),I=!1,b=!0,d.innerHTML=T.downloaded;
var a=document.createEvent("MouseEvents");
a.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),d.dispatchEvent(a);
}
if("downloading"==e.state)return;
("download_fail"==e.state||"default"==e.state)&&(o("fail, download_state : "+e.state),
window.clearInterval(y),I=!1,t("下载失败"),d.innerHTML=T.download);
}
});
}
var d=n.btn;
if(!d)return!1;
var l={},c=n.adData,p="",u="",m=c.androiddownurl;
if(m&&m.match){
var _=/&channelid\=([^&]*)/,w=m.match(_);
w&&w[1]&&(p="&channelid="+w[1],c.androiddownurl=m.replace(_,""));
}
n.via&&(u=["&via=ANDROIDWX.YYB.WX.ADVERTISE",n.via].join("."));
var f=!1,v="com.tencent.android.qqdownloader",g=1060125,k=!1,I=!1,b=!1,j=0,y=null,x=null,T={
download:"下载",
downloading:"下载中",
downloaded:"安装",
installed:"已安装"
};
d.innerHTML=T.download,s.ready(function(){
s.invoke("getInstallState",{
packageName:v
},function(n){
var e=n.err_msg;
o("getInstallState @yingyongbao : "+e);
var a=e.lastIndexOf("_")+1,t=e.substring(a);
1*t>=g&&e.indexOf("get_install_state:yes")>-1&&(f=!0);
}),s.invoke("getInstallState",{
packageName:c.pkgname
},function(n){
var e=n.err_msg;
o("getInstallState @"+c.pkgname+" : "+e);
var a=e.lastIndexOf("_")+1,t=e.substring(a);
1*t>=c.versioncode&&e.indexOf("get_install_state:yes")>-1&&(k=!0,d.innerHTML=T.installed);
}),d.addEventListener("click",function(){
if(o("click @js_app_action"),!I){
if(k)return!1;
if(b)return s.invoke("installDownloadTask",{
download_id:j,
file_md5:c.md5sum
},function(n){
var a=n.err_msg;
o("installDownloadTask : "+a),a.indexOf("install_download_task:ok")>-1?x=setInterval(e,1e3):t("安装失败！");
}),!1;
var m=function(){
return f?(i(c.is_appmsg?16:12,n),void s.invoke("launchApplication",{
schemeUrl:"tmast://download?oplist=1,2&pname="+c.pkgname+p+u
})):void s.invoke("addDownloadTask",{
task_name:c.appname,
task_url:c.androiddownurl,
extInfo:n.task_ext_info,
file_md5:c.md5sum
},function(e){
var l=e.err_msg;
o("addDownloadTask : "+l),l.indexOf("add_download_task:ok")>-1?(i(c.is_appmsg?15:11,n),
I=!0,j=e.download_id,o("download_id : "+j),d.innerHTML=T.downloading,y=setInterval(a,1e3)):t("调用下载器失败！");
});
};
return c.rl&&c.traceid?l[c.traceid]||(l[c.traceid]=!0,r({
url:"/mp/advertisement_report?report_type=2&type="+c.type+"&url="+encodeURIComponent(c.androiddownurl)+"&tid="+c.traceid+"&rl="+encodeURIComponent(c.rl)+"&__biz="+biz+"&ascene="+encodeURIComponent(window.ascene||-1)+"&pt="+c.pt+"&r="+Math.random(),
type:"GET",
timeout:1e3,
complete:function(){
l[c.traceid]=!1,m();
},
async:!0
})):m(),!1;
}
});
});
}
{
var l=(n("biz_common/dom/event.js"),n("biz_common/utils/report.js")),r=n("biz_wap/utils/ajax.js"),s=n("biz_wap/jsapi/core.js");
n("biz_wap/utils/openUrl.js").openUrlWithExtraWebview;
}
return d;
});define("a/profile.js",["biz_common/dom/event.js","biz_common/utils/report.js","a/a_report.js","biz_wap/utils/ajax.js","biz_common/utils/url/parse.js","biz_wap/utils/position.js","biz_wap/utils/openUrl.js","biz_wap/jsapi/core.js","biz_common/utils/monitor.js","a/a_utils.js"],function(e){
"use strict";
function t(e,t){
l("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+e+t.report_param);
}
function n(e,t){
if(t&&t.crt_exp_info)try{
var n=JSON.parse(t.crt_exp_info.html());
n.is_new_profile?j.invoke("profile",{
username:n.username
}):(console.log("exp to profile h5"),b(e));
}catch(i){
console.error("decode crt_exp_info error",t),b(e);
}else b(e);
return!1;
}
function i(e){
var t={
708:27,
135:28,
117:29
};
t[e]&&y.report115849(t[e]);
}
function a(e){
var a=e.adData,_=e.pos_type||0,b={},y=e.a_info;
e.report_param=e.report_param||"",function(){
function u(e){
i(a.crt_size);
{
var t=w.dataset;
"https:"==top.location.protocol?1500:1200;
}
if(t.rl&&t.url&&t.type&&t.tid){
var n=t.tid,o=t.type,s=t.url,r=t.rl;
if(!b[n]){
b[n]=!0;
var p,c,d,l,u=!!e&&e.target;
u&&(p=f.getX(u,"js_ad_link")+e.offsetX,c=f.getY(u,"js_ad_link")+e.offsetY,d=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientWidth,
l=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientHeight),
m({
type:o,
report_type:2,
click_pos:0,
url:encodeURIComponent(s),
tid:n,
rl:encodeURIComponent(r),
__biz:biz,
pos_type:_,
pt:a.pt,
pos_x:p,
pos_y:c,
ad_w:d||0,
ad_h:l||0
},function(){
b[n]=!1,k();
});
}
}else k();
}
var w=e.btnAddContact,v=e.btnViewProfile;
if(w&&w.dataset){
var z=function C(i,o){
var s=i.err_msg,r=a.is_appmsg?6:1;
-1!=s.indexOf("ok")?(v.style.display="inline-block",w.style.display="none",r=a.is_appmsg?9:4):"add_contact:added"==s?r=a.is_appmsg?7:2:"add_contact:cancel"==s?r=a.is_appmsg?8:3:(--o,
o>=0?j.invoke("addContact",{
scene:scene,
webtype:"1",
username:a.usename
},function(e){
C(e,o);
}):(s="addContact:fail|msg:"+s+"|uin:"+uin+"|biz:"+biz,l("http://mp.weixin.qq.com/mp/jsreport?key=13&content="+s+"&r="+Math.random()),
n(a.url,y))),t(r,e);
},k=function(){
t(a.is_appmsg?10:5,e),g.setSum(110696,7,1),o?g.setSum(110696,10,1):(o=!0,s=+new Date),
r?+new Date-r<2e3&&(g.setSum(110696,11,1),setTimeout(function(){
r=0;
},2e3)):r=+new Date,p?+new Date-p<3e3&&(g.setSum(110696,12,1),setTimeout(function(){
p=0;
},3e3)):p=+new Date,c?+new Date-c<4e3&&(g.setSum(110696,13,1),setTimeout(function(){
c=0;
},4e3)):c=+new Date,j.invoke("addContact",{
scene:scene,
webtype:"1",
username:a.usename
},function(e){
var t=+new Date-s;
g.setAvg(110696,9,t).send(),o=!1,z(e,1);
});
};
d.on(w,"click",u);
}
}(),function(){
var t=e.btnViewProfile;
t&&d.on(t,"click",function(){
i(a.crt_size);
var t=e.btnAddContact.dataset,o={
source:4,
tid:t.tid,
idx:idx,
mid:mid,
appuin:biz,
pt:a.pt,
aid:e.aid,
ad_engine:e.ad_engine,
pos_type:_
},s=u.join(a.url,o);
return n(s,e.a_info),!1;
});
}(),function(){
var o=e.btnProfile;
if(o){
var s=function p(i,o,s){
var r=i.err_msg,c=a.is_appmsg?6:1;
-1!=r.indexOf("ok")?(e.adData.biz_info.is_subscribed=1,console.log(s),s.innerHTML=s.innerHTML.replace("关注","查看"),
c=a.is_appmsg?9:4):"add_contact:added"==r?c=a.is_appmsg?7:2:"add_contact:cancel"==r?c=a.is_appmsg?8:3:(--o,
o>=0?j.invoke("addContact",{
scene:scene,
webtype:"1",
username:a.usename
},function(e){
p(e,o,s);
}):(r="addContact:fail|msg:"+r+"|uin:"+uin+"|biz:"+biz,l("http://mp.weixin.qq.com/mp/jsreport?key=13&content="+r+"&r="+Math.random()),
n(a.url,e.a_info))),t(c,e);
},r=function(n){
t(a.is_appmsg?10:5,e),j.invoke("addContact",{
scene:scene,
webtype:"1",
username:a.usename
},function(e){
s(e,1,n);
});
};
d.on(o,"click",function(t){
if(i(a.crt_size),console.log("has_click",b,e.adData),e.adData.biz_info.is_subscribed){
var o=e.adData;
o.tid=o.traceid;
var s={
source:4,
tid:o.tid,
idx:idx,
mid:mid,
appuin:biz,
pt:a.pt,
aid:e.aid,
ad_engine:e.ad_engine,
pos_type:_
},p=u.join(a.url,s);
n(p,e.a_info);
}else{
{
var o=e.adData;
"https:"==top.location.protocol?1500:1200;
}
if(o.tid=o.traceid,o.rl&&o.url&&o.type&&o.tid){
var c=o.tid,d=o.type,p=o.url,l=o.rl;
if(!b[c]){
console.log("has_click[tid]",b[c]),b[c]=!0;
var j,g,y,w,v=!!t&&t.target;
v&&(j=f.getX(v,"js_ad_link")+t.offsetX,g=f.getY(v,"js_ad_link")+t.offsetY,y=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientWidth,
w=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientHeight),
m({
type:d,
report_type:2,
click_pos:0,
url:encodeURIComponent(p),
tid:c,
rl:encodeURIComponent(l),
__biz:biz,
pos_type:_,
pt:a.pt,
pos_x:j,
pos_y:g,
ad_w:y||0,
ad_h:w||0
},function(){
b[c]=!1,r(v);
});
}
}else{
var v=!!t&&t.target;
r(v);
}
}
return!1;
});
}
}();
}
var o,s,r,p,c,d=e("biz_common/dom/event.js"),l=e("biz_common/utils/report.js"),_=e("a/a_report.js"),m=_.AdClickReport,u=(e("biz_wap/utils/ajax.js"),
e("biz_common/utils/url/parse.js")),f=e("biz_wap/utils/position.js"),b=e("biz_wap/utils/openUrl.js").openUrlWithExtraWebview,j=e("biz_wap/jsapi/core.js"),g=("https:"==top.location.protocol?5:0,
window.__report,e("biz_common/utils/monitor.js")),y=e("a/a_utils.js");
return a;
});define("a/app_card.js",["biz_common/dom/event.js","biz_common/dom/class.js","a/a_report.js","biz_wap/utils/position.js","biz_common/utils/report.js","biz_wap/jsapi/core.js","biz_wap/utils/mmversion.js","a/appdialog_confirm.js","biz_wap/utils/openUrl.js","a/a_utils.js","biz_common/utils/url/parse.js"],function(a,t,e,n){
"use strict";
function o(a){
"undefined"!=typeof c&&c.log&&c.log(a);
}
function s(a){
this.g={
app_status:"download",
btn:null,
download_id:0,
clock:null,
install_clock:null,
data:{},
channelid:"",
via:"",
report_param:"",
appdetail_params:"",
btn_percent:0,
btn_width:0,
btn_height:0
};
var t=this,e=this.g;
if(e.btn=a.btn,!e.btn)return!1;
e.data=a.adData,e.url_scheme=a.url_scheme,e.appdetail_params=a.appdetail_params||"",
e.percentStatus=a.percentStatus;
var s={};
e.channelid=e.data.channel_id||"",e.report_param=a.report_param;
var i=20;
if(("103"==e.data.pt||"104"==e.data.pt)&&t.setAppRating(a),"104"==e.data.pt||"113"==e.data.pt||"114"==e.data.pt||"122"==e.data.pt||e.data.use_new_protocol>0&&12==e.data.product_type){
var l=e.data.androiddownurl;
if(l&&l.match){
var _=/&channelid\=([^&]*)/,g=l.match(_);
g&&g[1]&&(e.channelid=g[1],e.data.androiddownurl=l.replace(_,""));
}
e.channelid&&(e.channelid="&channelid="+e.channelid),a.via&&(e.via=["&via=ANDROIDWX.YYB.WX.ADVERTISE",a.via].join("."));
}
c.ready(function(){
console.log("appcard info",e),("113"==e.data.pt||"114"==e.data.pt||"104"==e.data.pt||"122"==e.data.pt||e.data.use_new_protocol>0&&12==e.data.product_type)&&(c.invoke("getInstallState",{
packageName:b
},function(a){
var t=a.err_msg;
o("getInstallState @yingyongbao : "+t);
var e=t.lastIndexOf("_")+1,n=t.substring(e);
1*n>=v&&t.indexOf("get_install_state:yes")>-1&&(h=!0);
}),c.invoke("getInstallState",{
packageName:e.data.pkgname
},function(a){
var n=a.err_msg;
o("getInstallState @"+e.data.pkgname+" : "+n);
var s=n.lastIndexOf("_")+1,d=n.substring(s);
n.indexOf("get_install_state:yes")>-1&&t.setBtn(1*d>=e.data.versioncode&&e.url_scheme?"gotodetail":"installed");
})),console.log("bind btn",e.btn.id),d.on(e.btn,"click",function(d){
if(console.log("app click",e),console.log(d.target),"installed"==e.app_status)return t.setBtn("installed"),
!1;
if("gotodetail"==e.app_status)return t.report(74),t.gotoDetail(),!1;
if("downloading"==e.app_status)return t.report(71),t.pauseDownload(),!1;
if("paused"==e.app_status)return t.report(72),t.resumeDownload(),!1;
if("downloaded"==e.app_status)return t.report(73),c.invoke("installDownloadTask",{
download_id:e.download_id,
file_md5:e.data.md5sum
},function(a){
var s=a.err_msg;
o("installDownloadTask : "+s),s.indexOf("install_download_task:ok")>-1?e.install_clock=setInterval(t.installStateChange.bind(t),500):n("安装失败！");
}),!1;
var l=function(){
if("103"==e.data.pt||"111"==e.data.pt||"112"==e.data.pt||"121"==e.data.pt||e.data.use_new_protocol>0&&19==e.data.product_type){
t.report(23);
var s=e.data.ticket||window.ticket;
if(e.url_scheme&&u.gtVersion("6.5.6",!0)){
var d=1,l=navigator.userAgent.toLowerCase().match(/cpu iphone os (.*?) like mac os/);
l&&l[1]&&parseInt(l[1].split("_")[0],10)>=12&&(d=0);
var r={
schemeUrl:e.url_scheme,
messageExt:e.url_scheme,
appID:e.data.app_info.open_platform_appid,
installSchemeUrl:e.data.app_info.appinfo_url,
installAction:d
};
c.invoke("launchApplication",r,function(a){
(-1===a.err_msg.indexOf("ok")||"fail"===a.launchInstallResult)&&w.openWebAppStore(e.data.appinfo_url,s);
});
}else w.openWebAppStore(e.data.appinfo_url,s);
}else{
if(h)return t.report(16),void c.invoke("launchApplication",{
schemeUrl:"tmast://download?oplist=1,2&pname="+e.data.pkgname+e.channelid+e.via
});
t.report(15);
var p=[e.data.adid,e.data.traceid,(e.data.pkgname||"").replace(/\./g,"_"),e.data.source,i,a.engine].join("."),_=function(a,t,e){
console.log("addDownloadTask : "+a.data.appname+","+a.data.androiddownurl+","+t+","+a.data.md5sum),
c.invoke("addDownloadTaskStraight",{
task_name:a.data.appname,
task_url:a.data.androiddownurl,
extInfo:t,
file_md5:a.data.md5sum
},function(n){
var o=n.err_msg;
o.indexOf("ok")>-1?e&&e(n):c.invoke("addDownloadTask",{
task_name:a.data.appname,
task_url:a.data.androiddownurl,
extInfo:t,
file_md5:a.data.md5sum
},e);
}),a.url_scheme&&u.isAndroid&&u.gtVersion("6.5.6",!0)&&c.invoke("writeCommData",{
packageName:a.data.pkgname,
data:a.url_scheme
},function(a){
console.log(a);
});
};
console.log("addDownloadTask : "+e.data.appname+","+e.data.androiddownurl+","+p+","+e.data.md5sum),
_(e,p,function(a){
var s=a.err_msg;
o("addDownloadTask : "+s),s.indexOf("ok")>-1?(e.download_id=a.download_id,y[e.download_id]=t,
o("download_id : "+e.download_id),t.setBtn("downloading"),e.clock=setInterval(t.queryDownloadState.bind(t),500),
e.install_clock=setInterval(t.installStateChange.bind(t),500),t.changeDownloadState()):n("调用下载器失败！");
});
}
},_=function(){
return u.isIOS?void l():void m({
app_name:e.data.appname,
app_img_url:e.data.icon_url,
onOk:function(){
l(),t.report(h?106:100);
},
onCancel:function(){
t.report(h?107:101);
}
});
};
if("download"==e.app_status&&e.data.rl&&e.data.traceid){
if(!s[e.data.traceid]){
s[e.data.traceid]=!0;
var g,f,b,v,k=!!d&&d.target;
k&&(g=p.getX(k,"js_ad_link")+d.offsetX,f=p.getY(k,"js_ad_link")+d.offsetY,b=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientWidth,
v=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientHeight),
r({
type:e.data.type,
report_type:2,
click_pos:0,
url:encodeURIComponent(e.data.androiddownurl),
tid:e.data.traceid,
rl:encodeURIComponent(e.data.rl),
__biz:biz,
pos_type:a.pos_type||0,
pt:e.data.pt,
pos_x:g,
pos_y:f,
ad_w:b||0,
ad_h:v||0
},function(){
s[e.data.traceid]=!1,_();
});
}
}else _();
return!1;
});
});
}
var d=a("biz_common/dom/event.js"),i=a("biz_common/dom/class.js"),l=a("a/a_report.js"),r=l.AdClickReport,p=a("biz_wap/utils/position.js"),_=a("biz_common/utils/report.js"),c=a("biz_wap/jsapi/core.js"),u=a("biz_wap/utils/mmversion.js"),m=a("a/appdialog_confirm.js"),g=a("biz_wap/utils/openUrl.js"),w=a("a/a_utils.js"),f={
download:"下载",
downloading:"下载中",
paused:"继续",
downloaded:"安装",
gotodetail:"进入",
installed:"已安装"
},h=!1,b="com.tencent.android.qqdownloader",v=1060125,k=!1,y={},j=g.openUrlWithExtraWebview;
return s.prototype.report=function(a){
var t=this.g;
_("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+a+t.report_param);
},s.prototype.setBtn=function(a,t){
var e=this.g,n=e.data.pt;
if(e.app_status=a,e.percentStatus)return e.percentStatus(a,t),!1;
if("downloading"===a){
t=t||0;
var o="";
if(e.btn_width=e.btn.offsetWidth,e.btn_height=e.btn.offsetHeight,104===n?o='<i class="btn_processor" style="width:'+t+'%;"></i><span class="btn_processor_value js_btn_process">暂停('+t+"%)</span>":113===n||114===n?e.btn.innerHTML.indexOf("继续")>-1?(o=e.btn.innerHTML,
o=o.replace("继续","暂停")):o='<i class="btn_processor" style="width:'+t+'%;"></i><span class="btn_processor_value js_btn_process">暂停</span>':122===n?(e.btn.innerHTML.indexOf("继续")>-1?(o=e.btn.innerHTML,
o=o.replace(/继续/g,"暂停")):o='<span class="btn_progress_inner js_btn_process" style="width:'+t+'%;"><span id="percent_btn_2" class="btn_progress_bd js_btn_process" style="width:'+e.btn_width+'px;">暂停</span></span>暂停',
e.btn_percent=t):1===e.data.use_new_protocol?(e.btn_width=e.btn.offsetWidth,e.btn_height=e.btn.offsetHeight,
e.btn.innerHTML.indexOf("继续")>-1?(o=e.btn.innerHTML,o=o.replace(/继续/g,"暂停")):o='<span class="btn_progress_inner js_btn_process" style="width:'+t+'%;"><span id="percent_btn_2" class="btn_progress_bd js_btn_process" style="width:'+e.btn_width+"px; line-height: "+e.btn_height+'px">暂停下载</span></span>暂停下载',
e.btn_percent=t):o='<i class="btn_processor" style="width:'+t+'%;"></i><span class="btn_processor_value js_btn_process">'+t+"%</span>",
!o)return;
e.btn.innerHTML=o,122===n||1===e.data.use_new_protocol?i.addClass(e.btn,"btn_progress"):i.addClass(e.btn,"with_processor");
}else if("paused"===a){
var o="";
104===n||113===n||114===n||122===n||e.data.use_new_protocol>0?(o=e.btn.innerHTML,
o=o.replace(/暂停/g,"继续"),e.btn.innerHTML=o):(i.removeClass(e.btn,"with_processor"),
i.removeClass(e.btn,"btn_progress"),e.btn.innerHTML=f[a]);
}else i.removeClass(e.btn,"with_processor"),i.removeClass(e.btn,"btn_progress"),
e.btn.innerHTML=f[a],e.data.use_new_protocol>0&&"gotodetail"===a&&(e.btn.innerHTML="进入应用");
},s.prototype.setAppRating=function(a){
var t=this.g,e=a.js_app_rating,n=1*t.data.app_rating;
n>5&&(n=5),0>n&&(n=0);
var o=["","one","two","three","four","five"],s="",d=Math.floor(n);
if(s="star_"+o[d],n>d&&(n=d+.5,s+="_half"),e&&n>0){
var l=e.getElementsByClassName("js_stars"),r=e.getElementsByClassName("js_scores");
l&&r&&l[0]&&r[0]&&(l=l[0],r=r[0],l.style.display="inline-block",i.addClass(l,s));
}
},s.prototype.changeDownloadState=function(){
if(!k){
{
this.g;
}
k=!0,c.on("wxdownload:progress_change",function(a){
y[a.download_id]&&y[a.download_id].setBtn("downloading",a.progress);
});
}
},s.prototype.queryDownloadState=function(){
var a=this.g,t=this;
a.download_id&&c.invoke("queryDownloadTask",{
download_id:a.download_id
},function(e){
if(o("queryDownloadTask : "+e.state+"; dowloadid = "+a.download_id),e&&e.state){
if("download_succ"==e.state&&(t.setBtn("downloaded"),window.clearInterval(a.clock)),
"downloading"==e.state)return;
"download_fail"==e.state&&(window.clearInterval(a.clock),window.clearInterval(a.install_clock),
n("下载失败"),t.setBtn("download"));
}
});
},s.prototype.installStateChange=function(){
var a=this.g,t=this;
c.invoke("getInstallState",{
packageName:a.data.pkgname,
download_id:a.download_id
},function(e){
var n=e.err_msg;
n.indexOf("get_install_state:yes")>-1&&(o("getInstallState @app, version : "+n),
window.clearInterval(a.install_clock),t.setBtn(a.url_scheme?"gotodetail":"installed"));
});
},s.prototype.pauseDownload=function(){
var a=this.g,t=this;
c.invoke("pauseDownloadTask",{
packageName:a.data.pkgname,
download_id:a.download_id
},function(a){
a.err_msg.indexOf("pause_download_task:ok")>-1&&t.setBtn("paused");
});
},s.prototype.resumeDownload=function(){
var a=this.g,t=this;
c.invoke("resumeDownloadTask",{
packageName:a.data.pkgname,
download_id:a.download_id
},function(a){
a.err_msg.indexOf("ok")>-1&&t.setBtn("downloading");
});
},s.prototype.gotoDetail=function(){
var t=this.g;
if(104==t.data.pt||113==t.data.pt||114==t.data.pt||122==t.data.pt||t.data.use_new_protocol>0&&12==t.data.product_type&&t.url_scheme)u.gtVersion("6.5.6",!0)?c.invoke("launchApplication",{
schemeUrl:t.url_scheme
},function(a){
-1==a.err_msg.indexOf("ok")&&(location.href=t.url_scheme);
}):location.href=t.url_scheme;else{
var e=t.data.url,n=a("biz_common/utils/url/parse.js");
(!e||0!=e.indexOf("http://mp.weixin.qq.com/tp/")&&0!=e.indexOf("https://mp.weixin.qq.com/tp/"))&&(e="http://mp.weixin.qq.com/mp/ad_app_info?t=ad/app_detail&app_id="+t.data.app_id+(t.appdetail_params||"")+"&channel_id="+t.channelid+"&md5sum="+t.data.md5sum+"#wechat_redirect"),
t.url_scheme&&(e=n.join(e,{
is_installed:"1"
})),j(e);
}
},s;
});define("a/sponsor.js",["biz_common/dom/event.js","biz_common/utils/report.js","biz_wap/jsapi/core.js","biz_wap/utils/mmversion.js","a/a_report.js","biz_common/utils/url/parse.js","new_video/player.js","a/wxopen_card.js","biz_wap/utils/openUrl.js","biz_wap/utils/ajax.js","biz_wap/utils/device.js","common/utils.js"],function(e){
"use strict";
function t(e,t){
r("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+e+t.report_param);
}
function o(e,t,o,i){
r("http://mp.weixin.qq.com/mp/ad_complaint?&action=report&type="+e+"&pos_type="+t+"&trace_id="+o+"&aid="+i+"&__biz="+window.biz+"&r="+Math.random());
}
function i(){
w({
url:" /mp/ad_video_report?action=video_play_report",
data:window.__video_report_data,
type:"POST",
success:function(){}
});
}
function a(e,o,i){
o.canvas_info?_.invoke("openADCanvas",{
canvasId:o.canvas_info.canvas_id,
preLoad:0,
noStore:0,
extraData:JSON.stringify({
pos_type:o.pos_type
}),
adInfoXml:o.canvas_info.ad_info_xml
},function(o){
0!=o.ret?(u(e),t(135,i)):t(134,i);
}):u(e);
}
function n(e){
var n=e.adData,r=e.pos_type,_=n.traceid,s=e.a_info.type,w=n.adid,h=n.url,b=e.a_info.rl;
110==n.pt&&(h=h.replace("#","&AdType=80#"));
var j={};
e.report_param=e.report_param||"";
var z=e.adDetailBtn,x=e.adMoreBtn,T=(e.adMessage,e.adAbout),I=e.adComplain,k=e.adImg,W=e.adVideo,H=0,U=document.getElementById("js_sponsor_opt_list"),A={
type:s,
report_type:2,
url:encodeURIComponent(h),
tid:_,
rl:encodeURIComponent(b),
__biz:biz,
pos_type:r,
pt:n.pt,
click_pos:"",
aid:e.a_info.aid
},E=null,b=n.rl||"",M="";
if(b){
b=b.split("?"),b=b.length>1?b[1]:"";
var P=new RegExp("(^|&)viewid=([^&]*)(&|$)","i"),q=b.match(P);
q&&(M=unescape(q[2]));
}
window.__video_report_data={
aid:n.adid,
traceid:n.traceid,
user_uin:window.user_uin,
publisher_appid:n.publisher_appid||0,
appmsg_id:mid,
item_idx:idx,
viewid:M,
__biz:biz,
report_type:0,
play_type:0,
play_duration:0,
video_duration:0,
auto_play:1
};
var O=null,S=!0,C=!1;
if(p.isAndroid&&p.gtVersion("6.6.6",!0)&&(C=!0),console.log("data.videoUrl",n),W&&n.videoUrl){
E=new l({
container:W,
cover:n.thumbUrl,
width:W.offsetWidth,
height:W.offsetWidth*parseInt(n.displayHeight)/parseInt(n.displayWidth),
muted:!0,
ad_muted_btn:!0,
always_hide_loading:!0,
src:n.videoUrl,
autoHide:!0,
blockTouchVideo:!0,
onError:function(o){
console.log("播放出错",o),t(123,e),W.parentNode.innerHTML='<span class="ct_mpda_main_img img_bg_cover" id="js_main_img" style="background-image:url('+n.thumbUrl+"); height:"+m.clientWidth/1.77+'px;"></span>',
window.__video_report_data.play_type=3;
},
onEnd:function(){
t(122,e),window.__video_report_data.play_type=1,window.__video_report_data.play_duration=window.__video_report_data.video_duration,
window.__video_report_data.report_type=2,E.replay(),i();
},
onTimeupdate:function(e,t){
2==window.__video_report_data.report_type&&(window.__video_report_data.report_type=3,
i()),window.__video_report_data.play_type=2,window.__video_report_data.play_duration=1e3*t.currentTime,
window.__video_report_data.video_duration=1e3*E.__getDuration(),y||(window.__video_report_data.report_type=3,
i(),y=1);
}
}),H=29,E._showPlayer(),E.setSrc(n.videoUrl,"auto");
var B=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
if(p.isAndroid)if(m.offsetTop>B&&m.offsetTop<B+g.getInnerHeight())window.__video_report_data.auto_play=0;else{
var D=function R(){
E.__beginPlayHandler(),d.off(window,"touchstart",R),C=!0;
};
d.on(window,"touchstart",D);
}
var N=function V(){
if(3==window.__video_report_data.play_type)return void d.off(window,"scroll",V);
if(0!=window.__video_report_data.auto_play||0!=window.__video_report_data.play_type){
B=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
var o=g.getInnerHeight();
if(E.isPlay()&&(m.offsetTop>B+o||m.offsetTop+m.offsetHeight<B))E.pause();else if(!E.isPlay()&&v.canSupportAutoPlay&&!(m.offsetTop>B+o||m.offsetTop+m.offsetHeight<B)){
if(p.isAndroid&&!C)return;
0==window.__video_report_data.play_type&&1==window.__video_report_data.auto_play?(t(121,e),
p.isIOS&&E.triggerMuted(!0),E.__beginPlayHandler()):E.play();
}
}
};
d.on(window,"scroll",N),N(),O=function(){
window.setTimeout(function(){
E.triggerMuted(!0);
},1e3);
};
}
d.on(window,"touchend",function(e){
console.log(e.target),e.target==T||e.target==z||e.target==I||e.target.className.indexOf("js_opt_item")>=0||(T.style.display="none",
I.style.display="none",U.style.display="none");
}),d.on(document.getElementById("js_ad_inner"),"click",function(o){
if(o.target.className.indexOf("js_muted_btn")>-1)"true"==E.video.getAttribute("muted")?(E.triggerMuted(!1),
S=!1):(E.triggerMuted(!0),S=!0),t(124,e);else{
if(E&&(!E.isPlay()||0==window.__video_report_data.play_type))return E.__beginPlayHandler(),
S||E.triggerMuted(!1),t(121,e),void(window.__video_report_data.play_type=2);
"js_main_img"==o.target.id||o.target.className.indexOf("video_mask")>-1?j[_+"_1"]||(j[_+"_1"]=!0,
A.click_pos=1,f(A,function(){
t(87+H,e),j[_+"_1"]=!1,!!O&&O(),6!=e.a_info.dest_type?a(h,e.a_info,e):c.openWxopen(e.a_info);
})):j[_+"_2"]||(j[_+"_2"]=!0,A.click_pos=2,f(A,function(){
t(88+H,e),j[_+"_2"]=!1,!!O&&O(),6!=e.a_info.dest_type?a(h,e.a_info,e):c.openWxopen(e.a_info);
}));
}
return!1;
}),d.on(x,"click",function(){
return j[_+"_3"]||(j[_+"_3"]=!0,A.click_pos=3,f(A,function(){
t(89+H,e),j[_+"_3"]=!1,!!O&&O(),6!=e.a_info.dest_type?a(h,e.a_info,e):c.openWxopen(e.a_info);
})),!1;
}),d.on(z,"click",function(){
return t(90+H,e),o(0,r,e.a_info.traceid,e.a_info.aid),"none"==window.getComputedStyle(T).display?(T.style.display="initial",
U.style.display="initial",parseInt(window.can_see_complaint)&&(I.style.display="initial")):(T.style.display="none",
I.style.display="none",U.style.display="none"),!1;
}),d.on(T,"click",function(){
t(91+H,e);
var o="https://mp.weixin.qq.com/promotion/res/htmledition/mobile/html/trade_about.html?aid="+w+"&tid="+_+"#wechat_redirect";
return!!O&&O(),u(o),!1;
}),d.on(I,"click",function(){
var t="https://mp.weixin.qq.com/promotion/res/htmledition/mobile/html/feedback.html?aid="+e.a_info.aid+"&traceid="+e.a_info.traceid+"&source="+r+"&biz="+window.biz;
return!!O&&O(),o(1,r,e.a_info.traceid,e.a_info.aid),u(t),!1;
}),d.on(window,"resize",function(){
setTimeout(function(){
var t=m.clientWidth;
if(k&&2!=e.a_info.use_new_protocol)k.style.height=t/1.77+"px",console.log("do not change height");else{
var o=W.offsetWidth,i=W.offsetWidth*parseInt(n.displayHeight)/parseInt(n.displayWidth);
E.setHeight(i),E.setWidth(o),m.style.width=o,m.style.height=i;
}
},0);
});
}
var d=e("biz_common/dom/event.js"),r=e("biz_common/utils/report.js"),_=e("biz_wap/jsapi/core.js"),p=e("biz_wap/utils/mmversion.js"),s=e("a/a_report.js"),l=(e("biz_common/utils/url/parse.js"),
e("new_video/player.js")),c=e("a/wxopen_card.js"),u=e("biz_wap/utils/openUrl.js").openUrlWithExtraWebview,f=s.AdClickReport,m=(e("biz_common/utils/url/parse.js"),
document.getElementById("js_sponsor_ad_area")),w=e("biz_wap/utils/ajax.js"),y=!1,v=e("biz_wap/utils/device.js"),g=e("common/utils.js");
return n;
});define("a/tpl/cpc_tpl.html.js",[],function(){
return'<!--cpc 文中广告-->\n<div id="js_cpc_area" class="js_ad_link mpad_cpc <# if(pos_type == 0 || pos_type == 3){ #> article_bottom<# } #>" data-type="<#=type#>" data-ticket="<#=ticket#>" data-url="<#=url#>" data-rl="<#=rl#>"  data-aid="<#=aid#>" data-pt="<#=pt#>" data-tid="<#=traceid#>" data-gid="<#=group_id#>" data-apurl="<#=apurl#>" data-is_cpm="<#=is_cpm#>">\n    <!--有文字 "广告"-->\n    <!--<# if(tag_pos == \'left\'){ #>\n    "广告" 居左\n    <div class="mpad_cpc_adTag_left mpad_more_cps_left_container">广告<div href="javascript:;" class="mpad_more js_ad_opt_list_btn_<#=pos_type#>" <# if(!parseInt(can_see_complaint)){ #>style="display:none"<#}#>>\n                <ul class="mpad_more_list js_ad_opt_list js_ad_opt_list_<#=pos_type#>" style="display: none">\n                        <li class="mpad_more_list_ele">\n                            <a class="mpad_more_list_ele_container js_complain_btn_<#=pos_type#>" href="javascript:;">投诉</a>\n                        </li>\n                    </ul>\n        </div>\n    </div>\n    <# } else if(tag_pos == \'right\'){ #>\n    "广告" 居右\n    <div class="mpad_cpc_adTag_right mpad_more_cps_right_container">广告<div href="javascript:;" class="mpad_more js_ad_opt_list_btn_<#=pos_type#>" <# if(!parseInt(can_see_complaint)){ #>style="display:none"<#}#>>\n            <ul class="mpad_more_list js_ad_opt_list js_ad_opt_list_<#=pos_type#>" style="display: none">\n                <li class="mpad_more_list_ele">\n                    <a class="mpad_more_list_ele_container js_complain_btn_<#=pos_type#>" href="javascript:;">投诉</a>\n                </li>\n            </ul>\n        </div>\n    </div>\n    <# } #>-->\n    <div class="mpad_cpc_inner">\n        <# if(isVideo){ #> <!--视频-->\n        <div class="mpad_cpc_bd mpad_cpc_video"></div>\n        \n        <# }else{ #> <!--纯图片-->\n        <div class="mpad_cpc_bd js_ad_main_area js_material_<#=pos_type#>" style="background-image:url(<#=banner#>)" data-type="<#=type#>" data-ticket="<#=ticket#>" data-url="<#=url#>" data-rl="<#=rl#>"  data-aid="<#=aid#>" data-pt="<#=pt#>" data-tid="<#=traceid#>" data-gid="<#=group_id#>" data-apurl="<#=apurl#>" data-is_cpm="<#=is_cpm#>"></div>\n        <# } #>\n\n        <div class="mpad_cpc_ft <# if(!price){ #> single<# } #>">\n            <div class="mpad_cpc_ft_hd">\n                <# if(avatar){ #><!--头像-->\n                <span class="<# if(isDownload){ #> mpad_cpc_avatar<# }else{ #> mpad_cpc_avatar_round<# } #>" style="background: url(<#=avatar#>) no-repeat center; background-size: contain;"></span>\n                <# } #>\n                \n                \n                <div class="mpad_cpc_ft_msg">\n                    <!--有title和金额-->\n                    <# if(!!title){ #>\n                        <span class="mpad_cpc_ft_msg_title"><#=title#></span>\n                        <# if(!!price){ #>\n                        <span class="mpad_cpc_ft_msg_price">¥<#=price#></span>\n                        <# } #>\n                    <# } #>\n                    <# if(!(tag_pos == \'left\' || tag_pos == \'right\')){ #><!--广告标在里面-->\n                    <!--当没有title和价格的时候，出广告标，底部广告不会出现没有title的情况，所以底部不会出现广告标-->\n                    <div class="mpad_cpc_adTag_inner mpad_more_innertips_container <# if(!title && !price){ #> single<# } #> js_ad_opt_list_btn_<#=pos_type#>">广告<div href="javascript:;" class="mpad_more js_mpad_more" <# if(!parseInt(can_see_complaint)){ #>style="display:none"<#}#>>\n                            <ul class="mpad_more_list js_ad_opt_list js_ad_opt_list_<#=pos_type#>" style="display: none">\n                                <li class="mpad_more_list_ele">\n                                    <a class="mpad_more_list_ele_container js_complain_btn_<#=pos_type#>" href="javascript:;">投诉</a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                    <# } #>\n                </div>\n            </div>\n            <a href="javascript:void(0);" class="mpad_cpc_btn js_ad_btn_<#=pos_type#>" id="js_ad_btn_<#=pos_type#>">\n                <# if(!!is_wx_app){ #><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAAGz7rX1AAAAAXNSR0IArs4c6QAAA65JREFUSA2lVk9oVGcQ/+a9tytoSm6t5pBK9i0trdCTXlrx4EEF/1w0p+Klh9LiQcF9uy9Gu2rcfXlJUfAfth4UvPTPQVop9FCagzdBoaAI+xJjDgpCBaMbzO6+N8687Dy/Td6GRD/Iznwzv5n55vtm5kWp5VahEkyr+Gc51FJdoVJDlhpLVW0J6BqGA8AfiLgXTPPTWCc+FlNwRqc+wTB8KBZjQ/kOb7rnhO9AtOOdpnjHkyO6448/s7LZz33XPsFmUPCCMRXhUcNQmwwri61G474yYJwuZCE7tuA/CRK7KlZqJxlZPfrxA1F0pR2n0lF0MnC8yaZCNEVON3PALw78nmpU/hWz9SCYNwwojpZsX4zaqU5bItDp/MyMzXvDytxiWr7yZG39ef2ZosczTfW15frBl60W3lYA4YdWT2+hsL7OQH2Vv+2bo32PyKwwVDd4M+baSdSo1dzNsjX9/QHTxSvOiR52Pz3sb4mSovqlXIYeOq6mRP6uTOrNsTOnGhyjKx8Rx6DgqT9k96UaFL1gVxThX3QpqACHIYKdqHCrAtVMEhZPTCNUfzKlC5FqqxSqwXV63IMiYP3bpb26CEHhU+YTgzJiwgtIKOVzClEVEwOnEoT1ahA61cnvBSSUwIe4EyjpiHvJ4JqhhNi757u5SwIUSh1yYbNtW3RDcXHKMTyydgW0mA4OQiiyBQOAPhEklF484TXG4rvl63KqtY0I6m+FMEJ7ake1R8Ml7EI9VYInlMcGkVIdDdPZz8j+vWhqaazE47A/k2uEje/oyrcTfoBtANQk/d6iE/44Wsq9ED+rDuJ4tbMYqcPiYDlKc+3QaCl/cVVBnEptgppxGzumgpkDA3bQiW/rgahBDlLNX6MHin1TVj+tOEipGtghYk0cmmBs8dzcHdnrlAbGNzQwrsYyUPNSiDomlYdMJqsrIGMtmWusL3pTX6goPCtYyvhmR4vz+A8bzR8QcB+l+L9lmbsqhYH/xKAbLV981jM3O3uXiiAfRW9rXko0DiJTiT4nC354CgK8akUfPOrmWJe/np3Lk0lv3DxK3aRmOUkPfl8wFk2FX+gEgyygEnxJ7bTPL9r/CmAl1HM33iPcR92wFl8Nf1DiZZhH6BOWGgCbrXW6E2w222nr0nSeMoProsIo+plLUPZCi97kVxHihOwp5QnPtVO/RwlGY+ISbg/L85q8KwuGOueX8ke6AlIUHX1CJ+7l/0Aihfz1jEcF0Smqkn+yZvbyiNNPY2P16w2TL37yLBAjYAAAAABJRU5ErkJggg==" alt=""><# } #><#=btn_text#>\n            </a>\n        </div>\n    </div>\n</div>';
});define("a/appdialog_confirm.js",["widget/wx_profile_dialog_primary.css","a/a_utils.js","common/utils.js","biz_wap/jsapi/core.js","biz_common/utils/url/parse.js","biz_common/tmpl.js","biz_common/dom/event.js","a/appdialog_confirm.html.js"],function(o){
"use strict";
o("widget/wx_profile_dialog_primary.css");
var e=o("a/a_utils.js"),n=o("common/utils.js"),i=o("biz_wap/jsapi/core.js"),a=o("biz_common/utils/url/parse.js"),m=o("biz_common/tmpl.js"),c=o("biz_common/dom/event.js"),s=o("a/appdialog_confirm.html.js"),t=function(o){
if(e.isVideoSharePageOnlyAd()||n.isNativePage()||a.getQuery("get_ad_after_video"))return void i.invoke("confirmDialog",{
title:"是否立即下载该应用",
contentDesc:o.app_name,
confirmText:"下载",
cancelText:"取消",
msgIconUrl:o.app_img_url,
msgIconWidth:50,
msgIconHeight:50
},function(e){
e.err_msg.indexOf("confirmDialog:ok")>-1?o.onOk&&o.onOk():o.onCancel&&o.onCancel();
});
var t=document.createElement("div");
t.innerHTML=m.tmpl(s,o),document.body.appendChild(t),c.on(t.getElementsByClassName("js_ok")[0],"click",function(){
o.onOk&&o.onOk(),document.body.removeChild(t);
}),c.on(t.getElementsByClassName("js_cancel")[0],"click",function(){
o.onCancel&&o.onCancel(),document.body.removeChild(t);
});
};
return t;
});define("biz_common/dom/offset.js",[],function(){
"use strict";
function f(f){
if(!f)return{};
for(var t=0,e=0,o=parseInt(document.body.style.marginTop,10)||0;f.offsetParent;)t+=f.offsetTop,
e+=f.offsetLeft,f=f.offsetParent;
return{
offsetTop:t>o?t-o:t,
offsetLeft:e
};
}
return{
getOffset:f
};
});define("a/video.js",["biz_common/dom/event.js","biz_common/utils/report.js","biz_wap/jsapi/core.js","biz_wap/utils/mmversion.js","a/a_report.js","biz_common/utils/url/parse.js","new_video/player.js","biz_wap/utils/ajax.js","biz_wap/utils/device.js","common/utils.js"],function(e){
"use strict";
function t(e,t){
d("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+e+t);
}
function o(){
l({
url:" /mp/ad_video_report?action=video_play_report",
data:window.__video_report_data,
type:"POST"
});
}
function i(e,t,o){
var i;
return function(){
var r=this,a=arguments,d=function(){
i=null,o||e.apply(r,a);
},n=o&&!i;
clearTimeout(i),i=setTimeout(d,t),n&&e.apply(r,a);
};
}
function r(e){
var r=document.getElementById("js_video_container");
e.videoContainer&&(r=e.videoContainer);
var d=null,_=e.rl||"",l="";
if(_){
_=_.split("?"),_=_.length>1?_[1]:"";
var f=new RegExp("(^|&)viewid=([^&]*)(&|$)","i"),v=_.match(f);
v&&(l=unescape(v[2]));
}
window.__video_report_data={
aid:e.aid,
traceid:e.traceid,
user_uin:window.user_uin,
appmsg_id:mid,
item_idx:idx,
viewid:l,
__biz:biz,
report_type:0,
play_type:0,
play_duration:0,
video_duration:0,
auto_play:1
};
var y=null,g=!0,h=!1;
if(n.isAndroid&&n.gtVersion("6.6.6",!0)&&(h=!0),r){
d=new p({
container:r,
cover:e.video_info.thumbUrl,
width:r.offsetWidth,
height:r.offsetWidth*parseInt(e.video_info.displayHeight)/parseInt(e.video_info.displayWidth),
muted:g,
ad_muted_btn:g,
always_hide_loading:!0,
src:e.video_info.videoUrl,
pt:e.pt,
autoHide:!0,
blockTouchVideo:!0,
notPauseOtherVideoWhenPlay:!0,
onError:function(o){
console.log("播放出错",o),t(129,e.report_param),r.innerHTML='<span class="ct_mpda_main_img img_bg_cover" id="js_main_img" style="background-image:url('+e.video_info.thumbUrl+"); height:"+s.clientWidth/1.77+'px;"></span>',
window.__video_report_data.play_type=3;
},
onEnd:function(){
t(130,e.report_param),window.__video_report_data.play_type=1,window.__video_report_data.play_duration=window.__video_report_data.video_duration,
window.__video_report_data.report_type=2,d.replay(),o();
},
onTimeupdate:function(e,t){
2==window.__video_report_data.report_type&&(window.__video_report_data.report_type=3,
o()),window.__video_report_data.play_type=2,window.__video_report_data.play_duration=1e3*t.currentTime,
window.__video_report_data.video_duration=1e3*d.__getDuration(),u||(window.__video_report_data.report_type=3,
o(),u=1);
}
}),d._showPlayer(),d.setSrc(e.video_info.videoUrl,"auto");
var j=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,b=i(function(){
if(3==window.__video_report_data.play_type)return void a.off(window,"scroll",b);
if(0!=window.__video_report_data.auto_play||0!=window.__video_report_data.play_type){
j=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
var o=m.getInnerHeight();
if(d.isPlay()&&(s.offsetTop>j+o-s.offsetHeight/2||s.offsetTop+s.offsetHeight/2<j))d.pause4outer();else if((!c||c&&c>9)&&!d.isPlay()&&w.canSupportAutoPlay&&!(s.offsetTop>j+o+s.offsetHeight/2||s.offsetTop+s.offsetHeight<j-s.offsetHeight/2)){
if(n.isAndroid&&!h)return;
if(window.no_vedio_ad&&1==window.no_vedio_ad)return;
0==window.__video_report_data.play_type&&1==window.__video_report_data.auto_play?(t(131,e.report_param),
n.isIOS&&d.triggerMuted(g),d._trigger("beginPlay")):d.play4outer();
}
}
},500);
a.on(window,"scroll",b),b(),y=function(){
window.setTimeout(function(){
d.triggerMuted(g);
},1e3);
},this.adPlayer=d;
}
a.on(document.getElementById("js_video_container"),"tap",function(o){
if(o.target.className.indexOf("js_muted_btn")>-1)"true"==d.video.getAttribute("muted")?(d.triggerMuted(!1),
g=!1):(d.triggerMuted(!0),g=!0),t(132,e.report_param);else if(!d.isPlay())return d.__beginPlayHandler(),
d.triggerMuted(!0),t(133,e.report_param),void(window.__video_report_data.play_type=2);
}),a.on(window,"resize",function(){
setTimeout(function(){
var t=(s.clientWidth,r.offsetWidth),o=r.offsetWidth*parseInt(e.video_info.displayHeight)/parseInt(e.video_info.displayWidth);
d.setHeight(o),d.setWidth(t),s.style.width=t,s.style.height=o;
},0);
});
}
var a=e("biz_common/dom/event.js"),d=e("biz_common/utils/report.js"),n=(e("biz_wap/jsapi/core.js"),
e("biz_wap/utils/mmversion.js")),_=e("a/a_report.js"),p=(e("biz_common/utils/url/parse.js"),
e("new_video/player.js")),s=(_.AdClickReport,e("biz_common/utils/url/parse.js"),
document.getElementById("js_bottom_ad_area")),l=e("biz_wap/utils/ajax.js"),u=!1,w=e("biz_wap/utils/device.js"),m=e("common/utils.js"),c=m.getIosMainVersion();
return r;
});define("a/tpl/crt_tpl_manager.js",["a/tpl/crt_size_map.js","biz_common/tmpl.js","a/tpl/mpda_bottom_tpl.html.js","a/a_config.js","biz_wap/jsapi/core.js"],function(t){
"use strict";
function r(t,r,a,e){
this.crtSize=t,this.data=r,this.crtData=i(t,r),this.wrapper=a,this.extra=e,this.isInitAppStatus=!1,
this.updateData=function(t){
this.data=t,this.extra&&this.extra.customUpdataFunc?this.extra.customUpdataFunc(this.wrapper,this.data):o(this.crtSize,this.data,this.wrapper);
},this.getData=function(){
return this.data;
},this.getCrtData=function(){
return this.crtData;
},this.getWrapperElm=function(){
return this.wrapper;
};
var n=o(this.crtSize,this.data,this.wrapper);
this.extra&&this.extra.afterRenderFunc&&this.extra.afterRenderFunc(this.wrapper,this.data),
p[t]&&p[t].afterRender&&p[t].afterRender(n,this.wrapper);
}
function a(t,r){
var a,e,i;
if(!p[t])return console.error("[广告渲染失败]发现未见过的crt_size:",t),!1;
if(p[t].multiLogic)for(var n=0;n<p[t].multiLogic.length;n++)if(e=p[t].multiLogic[n],
e.selection){
i=!0;
for(var s in e.selection)e.selection[s]!=r[s]&&(i=!1);
if(i){
a=e;
break;
}
}else console.error("crt multiLogic need a selection param"),a=!1;else a=p[t];
return a;
}
function e(t,r){
var e=!1,i=a(t,r);
return i&&i.tpl&&(e=i.tpl),e;
}
function i(t,r){
var e={},i=a(t,r);
return i&&i.renderData&&(e=i.renderData),e;
}
function n(t,r,e){
var i=a(t,r);
if(i&&i.paramsAlias)for(var n in i.paramsAlias)e[n]=e[i.paramsAlias[n]];
return e;
}
function s(t,r,e){
var i=a(t,r);
return i&&i.paramsPreHandler&&(e=i.paramsPreHandler(e)),e;
}
function o(t,r,a){
var o=e(t,r),p=c(r,i(t,r)),f="";
if(p=n(t,r,p),p=s(t,r,p),console.log("crt final render data",p),!o)return console.error("[广告渲染失败] 模版找不到",t),
"";
try{
f=l.tmpl(o,p);
}catch(m){
console.error("[广告渲染失败] 编译模版失败",t,r,p,o),console.log(m);
}
return p.pos_type==h.AD_POS.POS_BOTTOM&&(f=l.tmpl(u,{
adTpl:f
})),console.log("[广告渲染完成] crtSize: ",t,"渲染数据：",p),a.innerHTML=f,p;
}
function c(t,r){
for(var a in r)t[a]=r[a];
return t;
}
{
var p=t("a/tpl/crt_size_map.js"),l=t("biz_common/tmpl.js"),u=t("a/tpl/mpda_bottom_tpl.html.js"),h=t("a/a_config.js");
t("biz_wap/jsapi/core.js");
}
return{
renderAdData:o,
createCrtObject:r,
CRT_CONF:p
};
});define("a/cpc_a_tpl.html.js",[],function(){
return'<!--有title “广告”，去掉 class appmsg_card_context。没有title “广告”，加class appmsg_card_context-->\n<div id="js_cpc_area"  class="js_ad_link  <# if(exp_obj.icon_pos != \'left\' && exp_obj.icon_pos != \'right\'){ #> appmsg_card_context <# } #> appmsg_card_active mpda_cpc_context pages_reset" data-type="<#=type#>" data-ticket="<#=ticket#>" data-url="<#=url#>" data-rl="<#=rl#>"  data-aid="<#=aid#>" data-pt="<#=pt#>" data-tid="<#=traceid#>" data-gid="<#=group_id#>" data-apurl="<#=apurl#>" data-is_cpm="<#=is_cpm#>">\n    <!--有文字 "广告"-->\n    <# if(exp_obj.icon_pos == \'left\'){ #>\n    <div class="appmsg_card_hd mpda_cpc_hd">\n      <!--"广告" 居左-->\n      <div class="mpda_cpc_title mpda_cpc_title_left mpad_more_cps_left_container js_ad_opt_list_btn_<#=pos_type#>">广告\n        <!--投诉入口 begin-->\n        <div href="javascript:;" class="mpad_more js_ad_opt_list_btn_<#=pos_type#>" <# if(!parseInt(window.can_see_complaint)){ #>style="visibility:hidden"<#}#>>\n                <ul class="mpad_more_list js_ad_opt_list js_ad_opt_list_<#=pos_type#>" style="display: none">\n                        <li class="mpad_more_list_ele">\n                            <a class="mpad_more_list_ele_container js_complain_btn_<#=pos_type#>" href="javascript:;">投诉</a>\n                        </li>\n                    </ul>\n        </div>\n        <!--投诉入口 end-->\n        </div>\n    </div>\n    <# } else if(exp_obj.icon_pos == \'right\'){ #>\n    <div class="appmsg_card_hd mpda_cpc_hd">\n      <!--"广告" 居右-->\n      <div class="mpda_cpc_title mpda_cpc_title_right mpad_more_cps_right_container js_ad_opt_list_btn_<#=pos_type#>">广告\n        <!--投诉入口 begin-->\n        <div href="javascript:;" class="mpad_more js_ad_opt_list_btn_<#=pos_type#>" <# if(!parseInt(window.can_see_complaint)){ #>style="visibility:hidden"<#}#>>\n                <ul class="mpad_more_list js_ad_opt_list js_ad_opt_list_<#=pos_type#>" style="display: none">\n                        <li class="mpad_more_list_ele">\n                            <a class="mpad_more_list_ele_container js_complain_btn_<#=pos_type#>" href="javascript:;">投诉</a>\n                        </li>\n                    </ul>\n        </div>\n        \n        <!--投诉入口 end-->\n      </div>\n    </div>\n    <# } #>\n    <div class="mpda_cpc_inner">\n      <div class="appmsg_card_bd mpda_cpc_bd" style="background-image:url(<#=image_url#>)"></div>\n\n      <div class="appmsg_card_ft mpda_cpc_ft <# if(!exp_obj.price){ #> single<# } #>" style="z-index: 2;">\n          <# if(exp_obj.icon_pos == \'left\' || exp_obj.icon_pos == \'right\'){ #>\n\n          <# } else { #>\n          <span class="dropdown_opr_tips mpad_more_innertips_container js_ad_opt_list_btn_<#=pos_type#>">\n              广告\n                <!--投诉入口 begin-->\n                <div href="javascript:;" class="mpad_more js_mpad_more" <# if(!parseInt(window.can_see_complaint)){ #>style="visibility:hidden"<#}#>>\n                    <ul class="mpad_more_list js_ad_opt_list js_ad_opt_list_<#=pos_type#>" style="display: none">\n                        <li class="mpad_more_list_ele">\n                            <a class="mpad_more_list_ele_container js_complain_btn_<#=pos_type#>" href="javascript:;">投诉</a>\n                        </li>\n                    </ul>\n                </div>\n                <!--投诉入口 end-->\n              <!--<span class="dropdown_opr_popover"></span>-->\n          </span>\n          <# } #>\n          <!--title 金额-->\n\n          <# if(!!exp_obj.sale_text){ #>\n          <span class="appmsg_card_msg">\n              <span class="appmsg_card_msg_title">\n                  <#=exp_obj.sale_text#>\n              </span>\n              <# if(!!exp_obj.price){ #>\n              <span class="appmsg_card_msg_supp price">\n                  ¥<#=exp_obj.price#>\n              </span>\n              <# } #>\n          </span>\n          <# } #>\n\n          <# if(dest_type == 9){ #>\n            <a href="javascript:void(0);" class="appmsg_card_btn wx_min_plain_btn ba_btn btn_progress">\n                <!-- 新广告协议逻辑跳转canvas不带id -->\n                <#=exp_obj.btn_text#>\n            </a>  \n          <# }else if(dest_type == 6){#>\n            <a href="javascript:void(0);" class="appmsg_card_btn">\n              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAAGz7rX1AAAAAXNSR0IArs4c6QAAA65JREFUSA2lVk9oVGcQ/+a9tytoSm6t5pBK9i0trdCTXlrx4EEF/1w0p+Klh9LiQcF9uy9Gu2rcfXlJUfAfth4UvPTPQVop9FCagzdBoaAI+xJjDgpCBaMbzO6+N8687Dy/Td6GRD/Iznwzv5n55vtm5kWp5VahEkyr+Gc51FJdoVJDlhpLVW0J6BqGA8AfiLgXTPPTWCc+FlNwRqc+wTB8KBZjQ/kOb7rnhO9AtOOdpnjHkyO6448/s7LZz33XPsFmUPCCMRXhUcNQmwwri61G474yYJwuZCE7tuA/CRK7KlZqJxlZPfrxA1F0pR2n0lF0MnC8yaZCNEVON3PALw78nmpU/hWz9SCYNwwojpZsX4zaqU5bItDp/MyMzXvDytxiWr7yZG39ef2ZosczTfW15frBl60W3lYA4YdWT2+hsL7OQH2Vv+2bo32PyKwwVDd4M+baSdSo1dzNsjX9/QHTxSvOiR52Pz3sb4mSovqlXIYeOq6mRP6uTOrNsTOnGhyjKx8Rx6DgqT9k96UaFL1gVxThX3QpqACHIYKdqHCrAtVMEhZPTCNUfzKlC5FqqxSqwXV63IMiYP3bpb26CEHhU+YTgzJiwgtIKOVzClEVEwOnEoT1ahA61cnvBSSUwIe4EyjpiHvJ4JqhhNi757u5SwIUSh1yYbNtW3RDcXHKMTyydgW0mA4OQiiyBQOAPhEklF484TXG4rvl63KqtY0I6m+FMEJ7ake1R8Ml7EI9VYInlMcGkVIdDdPZz8j+vWhqaazE47A/k2uEje/oyrcTfoBtANQk/d6iE/44Wsq9ED+rDuJ4tbMYqcPiYDlKc+3QaCl/cVVBnEptgppxGzumgpkDA3bQiW/rgahBDlLNX6MHin1TVj+tOEipGtghYk0cmmBs8dzcHdnrlAbGNzQwrsYyUPNSiDomlYdMJqsrIGMtmWusL3pTX6goPCtYyvhmR4vz+A8bzR8QcB+l+L9lmbsqhYH/xKAbLV981jM3O3uXiiAfRW9rXko0DiJTiT4nC354CgK8akUfPOrmWJe/np3Lk0lv3DxK3aRmOUkPfl8wFk2FX+gEgyygEnxJ7bTPL9r/CmAl1HM33iPcR92wFl8Nf1DiZZhH6BOWGgCbrXW6E2w222nr0nSeMoProsIo+plLUPZCi97kVxHihOwp5QnPtVO/RwlGY+ISbg/L85q8KwuGOueX8ke6AlIUHX1CJ+7l/0Aihfz1jEcF0Smqkn+yZvbyiNNPY2P16w2TL37yLBAjYAAAAABJRU5ErkJggg==" alt="">\n              <#=exp_obj.btn_text#>\n            </a>\n          <# }else{ #>\n            <a href="javascript:void(0);" class="appmsg_card_btn wx_min_plain_btn ba_btn btn_progress" id="js_ad_btn_<#=pos_type#>">\n                  <!-- 新广告协议逻辑 -->\n                  <#=exp_obj.btn_text#>\n              </a> \n          <# } #>\n        </div>\n    </div>\n</div>\n';
});