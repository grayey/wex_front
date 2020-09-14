(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[53],{1148:function(e,t,n){"use strict";n.r(t);var r=n(190),a=n(20),u=n(24),c=n(27),s=n(26),o=n(0),i=n.n(o),l=n(863),p=n(862),f=n(88),m=n(2),d=n.n(m),v=n(39),b=n(53),h=n(852),g=n(866),w=n(877),y=n(37),k=p.object().shape({email:p.string().required("username or email is required"),password:p.string().min(8,"Password must be 8 character long").required("password is required")}),x=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var u;return Object(a.a)(this,n),(u=t.call(this,e)).state={email:"",password:"",navigate:!1,isSubmitting:!1},u.handleChange=function(e){e.persist(),u.setState(Object(r.a)({},e.target.name,e.target.value))},u.handleSubmit=function(e){var t,n=u.state.isSubmitting;n=!n,u.setState({isSubmitting:n});var a=e.email,c=e.password,s=u.isEmail(a)?"email":"username",o=(t={},Object(r.a)(t,s,a),Object(r.a)(t,"password",c),t);u.appMainService.logUserIn(o).then((function(e){n=!n,u.setState({isSubmitting:n}),console.log("userResponse",e)})).catch((function(e){u.setState({isSubmitting:n});var t={type:"error",msg:y.g(e)};new w.a(t)}))},u.isEmail=function(e){return e.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)},u.appMainService=new g.a,u}return Object(u.a)(n,[{key:"render",value:function(){var e;return i.a.createElement("div",{className:"auth-layout-wrap",style:{backgroundColor:"transparent !important"}},i.a.createElement("div",{className:"auth-content"},i.a.createElement("div",{className:"".concat((null===(e=this.props)||void 0===e?void 0:e.public)?"cardx":"card"," o-hidden")},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"col-md-6"},i.a.createElement("div",{className:"p-4"},i.a.createElement("div",{className:"auth-logo text-center mb-4"},i.a.createElement("img",{src:"/assets/images/logo.png",alt:""})),i.a.createElement("h1",{className:"mb-3 text-18"},"Sign In"),i.a.createElement(l.b,{initialValues:this.state,validationSchema:k,onSubmit:this.handleSubmit},(function(e){var t=e.values,n=e.errors,r=(e.touched,e.handleChange),a=e.handleBlur,u=e.handleSubmit;e.isSubmitting;return i.a.createElement("form",{onSubmit:u},i.a.createElement("div",{className:"form-group"},i.a.createElement("label",{htmlFor:"email"},"Username ",i.a.createElement("b",null,"OR")," Email"),i.a.createElement("input",{className:"form-control form-control-rounded position-relative",type:"text",name:"email",onChange:r,onBlur:a,value:t.email}),n.email&&i.a.createElement("div",{className:"text-danger mt-1 ml-2"},n.email)),i.a.createElement("div",{className:"form-group"},i.a.createElement("label",{htmlFor:"password"},"Password"),i.a.createElement("input",{className:"form-control form-control-rounded",type:"password",name:"password",onChange:r,onBlur:a,value:t.password}),n.password&&i.a.createElement("div",{className:"text-danger mt-1 ml-2"},n.password)),i.a.createElement("button",{className:"btn btn-rounded btn-primary btn-block mt-2",type:"submit"},"Sign In"))})),i.a.createElement("div",{className:"mt-3 text-center"},i.a.createElement(b.a,{to:"/session/forgot-password",className:"text-muted"},i.a.createElement("u",null,"Forgot Password?"))))),i.a.createElement("div",{className:"col-md-6 text-center ",style:{backgroundSize:"cover",backgroundImage:"url(/assets/images/photo-long-3.jpg)"}},i.a.createElement("div",{className:"pr-3 auth-right"},i.a.createElement(b.a,{to:"/session/signup",className:"btn btn-rounded btn-outline-primary btn-outline-email btn-block btn-icon-text"},i.a.createElement("i",{className:"i-Mail-with-At-Sign"})," Sign up with Email"),i.a.createElement(h.a,{className:"btn btn-rounded btn-outline-google btn-block btn-icon-text"},i.a.createElement("i",{className:"i-Google-Plus"})," Sign up with Google"),i.a.createElement(h.a,{className:"btn btn-rounded btn-block btn-icon-text btn-outline-facebook"},i.a.createElement("i",{className:"i-Facebook-2"})," Sign up with Facebook")))))))}}]),n}(o.Component);t.default=Object(v.b)((function(e){return{loginWithEmailAndPassword:d.a.func.isRequired,user:e.user}}),{loginWithEmailAndPassword:f.e})(x)},824:function(e,t,n){"use strict";t.a=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((function(e){return null!=e})).reduce((function(e,t){if("function"!==typeof t)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?t:function(){for(var n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];e.apply(this,r),t.apply(this,r)}}),null)}},825:function(e,t,n){"use strict";var r=n(4),a=n(10),u=n(0),c=n.n(u),s=n(824);function o(e){return!e||"#"===e.trim()}var i=c.a.forwardRef((function(e,t){var n=e.as,u=void 0===n?"a":n,i=e.disabled,l=e.onKeyDown,p=Object(a.a)(e,["as","disabled","onKeyDown"]),f=function(e){var t=p.href,n=p.onClick;(i||o(t))&&e.preventDefault(),i?e.stopPropagation():n&&n(e)};return o(p.href)&&(p.role=p.role||"button",p.href=p.href||"#"),i&&(p.tabIndex=-1,p["aria-disabled"]=!0),c.a.createElement(u,Object(r.a)({ref:t},p,{onClick:f,onKeyDown:Object(s.a)((function(e){" "===e.key&&(e.preventDefault(),f(e))}),l)}))}));i.displayName="SafeAnchor",t.a=i},833:function(e,t,n){"use strict";function r(e,t,n,r,a,u,c){try{var s=e[u](c),o=s.value}catch(i){return void n(i)}s.done?t(o):Promise.resolve(o).then(r,a)}function a(e){return function(){var t=this,n=arguments;return new Promise((function(a,u){var c=e.apply(t,n);function s(e){r(c,a,u,s,o,"next",e)}function o(e){r(c,a,u,s,o,"throw",e)}s(void 0)}))}}n.d(t,"a",(function(){return a}))},852:function(e,t,n){"use strict";var r=n(4),a=n(10),u=n(6),c=n.n(u),s=n(0),o=n.n(s),i=n(52),l=n(825),p=o.a.forwardRef((function(e,t){var n=e.bsPrefix,u=e.variant,s=e.size,p=e.active,f=e.className,m=e.block,d=e.type,v=e.as,b=Object(a.a)(e,["bsPrefix","variant","size","active","className","block","type","as"]),h=Object(i.a)(n,"btn"),g=c()(f,h,p&&"active",h+"-"+u,m&&h+"-block",s&&h+"-"+s);if(b.href)return o.a.createElement(l.a,Object(r.a)({},b,{as:v,ref:t,className:c()(g,b.disabled&&"disabled")}));t&&(b.ref=t),d?b.type=d:v||(b.type="button");var w=v||"button";return o.a.createElement(w,Object(r.a)({},b,{className:g}))}));p.displayName="Button",p.defaultProps={variant:"primary",active:!1,disabled:!1},t.a=p},866:function(e,t,n){"use strict";n.d(t,"a",(function(){return y}));var r=n(135),a=n.n(r),u=n(833),c=n(20),s=n(24),o=n(27),i=n(26),l=n(0),p=n(12),f=n.n(p),m="production",d=m.trim();console.log("env",m,Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}));var v={development:{base_url:"http://localhost:5000/api",base_url_front:""},production:{base_url:"https://wex-backend.herokuapp.com/api",base_url_front:""}}[d].base_url,b=function(){var e=Object(u.a)(a.a.mark((function e(t){var n,r,u=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=u.length>1&&void 0!==u[1]?u[1]:null,r="".concat(v,"/").concat(t),r=n?"".concat(r,"/").concat(n):r,e.next=5,f.a.get(r).then((function(e){return e.data})).then((function(e){return e})).catch((function(e){throw{data:e,message:e.message,requestStatus:!1,statusCode:e}}));case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),h=function(){var e=Object(u.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="".concat(v,"/").concat(t),e.next=3,f.a.post(r,n).then((function(e){return e.data})).catch((function(e){var t=e.response;throw console.log(t),t}));case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),g=function(){var e=Object(u.a)(a.a.mark((function e(t){var n,r,u=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=u.length>1&&void 0!==u[1]?u[1]:null,r="".concat(v,"/").concat(t),e.next=4,f.a.put(r,n).then((function(e){return e.data})).catch((function(e){throw e.response}));case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),w=function(){var e=Object(u.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="".concat(v,"/").concat(t),e.next=3,f.a.delete(n).then((function(e){return e.data})).catch((function(e){throw e.response}));case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();var y=function(e){Object(o.a)(n,e);var t=Object(i.a)(n);function n(e){return Object(c.a)(this,n),t.call(this,e)}return Object(s.a)(n,[{key:"logUserIn",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h("users/auth/login",t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAllUsers",value:function(){var e=Object(u.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"users",e.next=3,b("users");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"createUser",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"users/",e.next=3,h("users/",t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateUser",value:function(){var e=Object(u.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="users/".concat(n,"/"),e.next=3,g(r,t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"deleteUser",value:function(){var e=Object(u.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="users/".concat(t._id),e.next=3,w(n);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"toggleUser",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.status=!t.status,e.abrupt("return",this.updateUser(t,t._id));case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getUserBySlug",value:function(){var e=Object(u.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="users/".concat(t),e.next=3,b(n);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAllRoles",value:function(){var e=Object(u.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"roles",e.next=3,b("roles");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"createRole",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"roles/",e.next=3,h("roles/",t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateRole",value:function(){var e=Object(u.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roles/".concat(n,"/"),e.next=3,g(r,t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"deleteRole",value:function(){var e=Object(u.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="roles/".concat(t._id),e.next=3,w(n);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"toggleRole",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.status=!t.status,e.abrupt("return",this.updateRole(t,t._id));case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getRoleBySlug",value:function(){var e=Object(u.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="roles/".concat(t),e.next=3,b(n);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAllCategories",value:function(){var e=Object(u.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"categories",e.next=3,b("categories");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"createCategory",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"categories/",e.next=3,h("categories/",t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateCategory",value:function(){var e=Object(u.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="categories/".concat(n,"/"),e.next=3,g(r,t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"deleteCategory",value:function(){var e=Object(u.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="categories/".concat(t._id),e.next=3,w(n);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"toggleCategory",value:function(){var e=Object(u.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.status=!t.status,e.abrupt("return",this.updateCategory(t,t._id));case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAllTasks",value:function(){var e=Object(u.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"tasks",e.next=3,b("tasks");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}]),n}(l.Component)},877:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(20),a=n(191),u=function e(t){Object(r.a)(this,e);var n=t.type,u=t.timeOut||1e4,c=t.msg,s=n;a.NotificationManager[n](c,s,u)}}}]);
//# sourceMappingURL=53.965fa451.chunk.js.map