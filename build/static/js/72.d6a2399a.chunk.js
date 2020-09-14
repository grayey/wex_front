(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[72],{2262:function(e,a,t){"use strict";t.r(a);var n=t(20),c=t(24),r=t(27),i=t(26),s=t(0),o=t.n(s),l=t(182),m=t(852),u=t(191),f=function(e){Object(r.a)(t,e);var a=Object(i.a)(t);function t(){var e;Object(n.a)(this,t);for(var c=arguments.length,r=new Array(c),i=0;i<c;i++)r[i]=arguments[i];return(e=a.call.apply(a,[this].concat(r))).state={},e}return Object(c.a)(t,[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(l.a,{routeSegments:[{name:"Home",path:"/"},{name:"Extra Kits",path:"/extra-kits"},{name:"Toastr"}]}),o.a.createElement("h3",{className:"card-title"},"Types"),o.a.createElement("div",{className:"row mb-4"},o.a.createElement("div",{className:"col-md-6 mb-4"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{variant:"outline-success",className:"btn-block",onClick:function(){u.NotificationManager.success("success message","Success Title")}},"success toaster"),o.a.createElement(m.a,{variant:"outline-info",className:"btn-block",onClick:function(){u.NotificationManager.info("info message","Info Title")}},"info toaster")))),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{variant:"outline-warning",className:"btn-block",onClick:function(){u.NotificationManager.warning("warning message","warning Title")}},"warning toaster"),o.a.createElement(m.a,{variant:"outline-danger",className:"btn-block",onClick:function(){u.NotificationManager.error("danger message","danger Title")}},"danger toaster"))))),o.a.createElement("h3",{className:"card-title"},"Toastr with timeout"),o.a.createElement("div",{className:"row mb-4"},o.a.createElement("div",{className:"col-md-6 mb-4"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{variant:"outline-success",className:"btn-block",onClick:function(){u.NotificationManager.success("success message","Success Title",1e4)}},"success toaster"),o.a.createElement(m.a,{variant:"outline-info",className:"btn-block",onClick:function(){u.NotificationManager.info("info message","Info Title",1e4)}},"info toaster")))),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{variant:"outline-warning",className:"btn-block",onClick:function(){u.NotificationManager.warning("warning message","warning Title",1e4)}},"warning toaster"),o.a.createElement(m.a,{variant:"outline-danger",className:"btn-block",onClick:function(){u.NotificationManager.error("danger message","danger Title",1e4)}},"danger toaster"))))),o.a.createElement("h3",{className:"card-title"},"Toastr with priority"),o.a.createElement("div",{className:"row mb-4"},o.a.createElement("div",{className:"col-md-6 mb-4"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{variant:"outline-success",className:"btn-block",onClick:function(){u.NotificationManager.success("success message","Success Title",5e3,(function(){}),4)}},"success toaster"),o.a.createElement(m.a,{variant:"outline-info",className:"btn-block",onClick:function(){u.NotificationManager.info("info message","Info Title",5e3,(function(){}),3)}},"info toaster")))),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{variant:"outline-warning",className:"btn-block",onClick:function(){u.NotificationManager.warning("warning message","warning Title",5e3,(function(){}),2)}},"warning toaster"),o.a.createElement(m.a,{variant:"outline-danger",className:"btn-block",onClick:function(){u.NotificationManager.error("danger message","danger Title",5e3,(function(){}),1)}},"danger toaster"))))),o.a.createElement(u.NotificationContainer,null))}}]),t}(s.Component);a.default=f},824:function(e,a,t){"use strict";a.a=function(){for(var e=arguments.length,a=new Array(e),t=0;t<e;t++)a[t]=arguments[t];return a.filter((function(e){return null!=e})).reduce((function(e,a){if("function"!==typeof a)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?a:function(){for(var t=arguments.length,n=new Array(t),c=0;c<t;c++)n[c]=arguments[c];e.apply(this,n),a.apply(this,n)}}),null)}},825:function(e,a,t){"use strict";var n=t(4),c=t(10),r=t(0),i=t.n(r),s=t(824);function o(e){return!e||"#"===e.trim()}var l=i.a.forwardRef((function(e,a){var t=e.as,r=void 0===t?"a":t,l=e.disabled,m=e.onKeyDown,u=Object(c.a)(e,["as","disabled","onKeyDown"]),f=function(e){var a=u.href,t=u.onClick;(l||o(a))&&e.preventDefault(),l?e.stopPropagation():t&&t(e)};return o(u.href)&&(u.role=u.role||"button",u.href=u.href||"#"),l&&(u.tabIndex=-1,u["aria-disabled"]=!0),i.a.createElement(r,Object(n.a)({ref:a},u,{onClick:f,onKeyDown:Object(s.a)((function(e){" "===e.key&&(e.preventDefault(),f(e))}),m)}))}));l.displayName="SafeAnchor",a.a=l},852:function(e,a,t){"use strict";var n=t(4),c=t(10),r=t(6),i=t.n(r),s=t(0),o=t.n(s),l=t(52),m=t(825),u=o.a.forwardRef((function(e,a){var t=e.bsPrefix,r=e.variant,s=e.size,u=e.active,f=e.className,d=e.block,b=e.type,v=e.as,g=Object(c.a)(e,["bsPrefix","variant","size","active","className","block","type","as"]),N=Object(l.a)(t,"btn"),E=i()(f,N,u&&"active",N+"-"+r,d&&N+"-block",s&&N+"-"+s);if(g.href)return o.a.createElement(m.a,Object(n.a)({},g,{as:v,ref:a,className:i()(E,g.disabled&&"disabled")}));a&&(g.ref=a),b?g.type=b:v||(g.type="button");var k=v||"button";return o.a.createElement(k,Object(n.a)({},g,{className:E}))}));u.displayName="Button",u.defaultProps={variant:"primary",active:!1,disabled:!1},a.a=u}}]);
//# sourceMappingURL=72.d6a2399a.chunk.js.map