(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[94],{2336:function(e,t,a){"use strict";a.r(t);var n=a(20),l=a(24),c=a(27),r=a(26),i=a(0),s=a.n(i),o=(a(73),a(217)),m=a(1249),u=a(39),d=a(31),p=a(37),g=a(2305),E=a(1071),h=a(1072),v=a(2),N=a.n(v),b=a(45),f=a(53),y=a(17),x=a(1248),S=a(193),k=a.n(S),w=a(1083),O=function(e){Object(c.a)(a,e);var t=Object(r.a)(a);function a(){var e;Object(n.a)(this,a);for(var l=arguments.length,c=new Array(l),r=0;r<l;r++)c[r]=arguments[r];return(e=t.call.apply(t,[this].concat(c))).state={shorcutMenuList:[{icon:"i-Shop-4",link:"#",text:"Home"},{icon:"i-Library",link:"#",text:"Ui Kits"},{icon:"i-Drop",link:"#",text:"Apps"},{icon:"i-File-Clipboard-File--Text",link:"#",text:"Form"},{icon:"i-Checked-User",link:"#",text:"Sessions"},{icon:"i-Ambulance",link:"#",text:"Support"}],notificationList:[{icon:"i-Speach-Bubble-6",title:"New message",description:"James: Hey! are you busy?",time:"2019-10-30T02:10:18.931Z",color:"primary",status:"New"},{icon:"i-Receipt-3",title:"New order received",description:"1 Headphone, 3 iPhone",time:"2019-03-10T02:10:18.931Z",color:"success",status:"New"},{icon:"i-Empty-Box",title:"Product out of stock",description:"1 Headphone, 3 iPhone",time:"2019-05-10T02:10:18.931Z",color:"danger",status:"3"},{icon:"i-Data-Power",title:"Server up!",description:"Server rebooted successfully",time:"2019-03-10T02:10:18.931Z",color:"success",status:"3"}]},e.handleMenuClick=function(){var t=e.props,a=t.setLayoutSettings,n=t.settings;a(Object(d.merge)({},n,{layout3Settings:{leftSidebar:{open:!n.layout3Settings.leftSidebar.open}}}))},e.toggleFullScreen=function(){document.fullscreenEnabled&&(document.fullscreen?document.exitFullscreen():document.documentElement.requestFullscreen())},e.handleSearchBoxOpen=function(){var t=e.props,a=t.setLayoutSettings,n=t.settings;a(Object(d.merge)({},n,{layout3Settings:{searchBox:{open:!0}}}))},e}return Object(l.a)(a,[{key:"render",value:function(){var e=this.state,t=e.shorcutMenuList,a=void 0===t?[]:t,n=e.notificationList,l=void 0===n?[]:n,c=this.props.settings;return s.a.createElement(i.Fragment,null,s.a.createElement("div",{className:"main-header"},s.a.createElement("div",{className:"logo"},s.a.createElement("img",{src:"/assets/images/logo.png",alt:""})),s.a.createElement("div",{className:"menu-toggle",onClick:this.handleMenuClick},s.a.createElement("div",null),s.a.createElement("div",null),s.a.createElement("div",null)),s.a.createElement("div",{className:"d-none d-lg-flex align-items-center"},s.a.createElement(g.a,{className:"mr-3"},s.a.createElement(g.a.Toggle,{variant:"link",id:"dropdown-basic"},"Mega Menu"),s.a.createElement("div",{className:"mega-menu"},s.a.createElement(g.a.Menu,null,s.a.createElement(w.a,null)))),s.a.createElement("div",{className:"search-bar"},s.a.createElement("input",{type:"text",placeholder:"Search",onFocus:this.handleSearchBoxOpen}),s.a.createElement("i",{className:"search-icon text-muted i-Magnifi-Glass1"}))),s.a.createElement("div",{style:{margin:"auto"}}),s.a.createElement("div",{className:"header-part-right"},s.a.createElement("i",{className:"i-Full-Screen header-icon d-none d-sm-inline-block","data-fullscreen":!0,onClick:this.toggleFullScreen}),s.a.createElement(g.a,null,s.a.createElement(g.a.Toggle,{variant:"link",className:"toggle-hidden"},s.a.createElement("i",{className:"i-Safe-Box text-muted header-icon",role:"button"})),s.a.createElement(g.a.Menu,null,s.a.createElement("div",{className:"menu-icon-grid"},a.map((function(e){return s.a.createElement(f.a,{key:e.text,to:e.link},s.a.createElement("i",{className:e.icon})," ",e.text)}))))),s.a.createElement(g.a,null,s.a.createElement(g.a.Toggle,{variant:"link",className:"toggle-hidden"},s.a.createElement("div",{className:"badge-top-container",role:"button",id:"dropdownNotification","data-toggle":"dropdown"},s.a.createElement("span",{className:"badge badge-primary"},"3"),s.a.createElement("i",{className:"i-Bell text-muted header-icon"}))),s.a.createElement(E.a,{className:"notification-dropdown rtl-ps-none"},l.map((function(e,t){return s.a.createElement("div",{key:t,className:"dropdown-item d-flex"},s.a.createElement("div",{className:"notification-icon"},s.a.createElement("i",{className:"".concat(e.icon," text-").concat(e.color," mr-1")})),s.a.createElement("div",{className:"notification-details flex-grow-1"},s.a.createElement("p",{className:"m-0 d-flex align-items-center"},s.a.createElement("span",null,e.title),s.a.createElement("span",{className:"badge badge-pill badge-".concat(e.color," ml-1 mr-1")},e.status),s.a.createElement("span",{className:"flex-grow-1"}),s.a.createElement("span",{className:"text-small text-muted ml-auto"},Object(p.d)(new Date(e.time))," ago")),s.a.createElement("p",{className:"text-small text-muted m-0"},e.description)))})))),s.a.createElement("div",{className:"user col align-self-end"},s.a.createElement(g.a,null,s.a.createElement(h.a,{variant:"link",className:"toggle-hidden"},s.a.createElement("img",{src:"/assets/images/faces/1.jpg",id:"userDropdown",alt:"","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"})),s.a.createElement(E.a,null,s.a.createElement("div",{className:"dropdown-header"},s.a.createElement("i",{className:"i-Lock-User mr-1"})," Timothy Carlson"),s.a.createElement("span",{className:"dropdown-item cursor-pointer"},"Account settings"),s.a.createElement("span",{className:"dropdown-item cursor-pointer"},"Billing history"),s.a.createElement("span",{className:"dropdown-item cursor-pointer",onClick:this.props.logoutUser},"Sign out")))))),s.a.createElement("div",{className:"horizontal-bar-wrap"},s.a.createElement("div",{className:Object(p.a)({"header-topnav":!0,open:c.layout3Settings.leftSidebar.open})},s.a.createElement("div",{className:"container-fluid"},s.a.createElement(k.a,{className:"topnav position-relative rtl-ps-none"},s.a.createElement("ul",{className:"menu float-left"},x.a.map((function(e,t){return s.a.createElement("li",{key:t},s.a.createElement("div",null,s.a.createElement("div",null,s.a.createElement("label",{className:"toggle",htmlFor:"drop-".concat(t)},e.name),s.a.createElement(f.a,{to:e.sub?"#":e.path},s.a.createElement("i",{className:"nav-icon mr-2 ".concat(e.icon)}),e.name),s.a.createElement("input",{type:"checkbox",id:"drop-".concat(t)}),s.a.createElement("ul",null,e.sub&&e.sub.map((function(e,t){return s.a.createElement("li",{key:t},s.a.createElement(f.a,{to:e.path||"#"},s.a.createElement("i",{className:"nav-icon mr-2 ".concat(e.icon)}),s.a.createElement("span",{className:"item-name"},e.name)))}))))))}))))))))}}]),a}(i.Component),j=Object(y.g)(Object(u.b)((function(e){return{setLayoutSettings:N.a.func.isRequired,settings:e.layout.settings}}),{setLayoutSettings:b.d})(O)),C=a(1250),B=function(e){Object(c.a)(a,e);var t=Object(r.a)(a);function a(){var e;Object(n.a)(this,a);for(var l=arguments.length,c=new Array(l),r=0;r<l;r++)c[r]=arguments[r];return(e=t.call.apply(t,[this].concat(c))).state={},e.handleSearchBoxClose=function(){var t=e.props,a=t.setLayoutSettings,n=t.settings;a(Object(d.merge)({},n,{layout3Settings:{searchBox:{open:!1}}}))},e}return Object(l.a)(a,[{key:"render",value:function(){var e=this.props,t=e.settings,a=e.routes;return s.a.createElement("div",null,s.a.createElement("div",{className:"app-admin-wrap  layout-horizontal-bar"},s.a.createElement(j,null),s.a.createElement("div",{className:Object(p.a)({"main-content-wrap d-flex flex-column":!0})},s.a.createElement("div",{className:"main-content"},Object(o.a)(a)),s.a.createElement(m.a,null))),s.a.createElement(C.a,{open:t.layout3Settings.searchBox.open,handleClose:this.handleSearchBoxClose}))}}]),a}(i.Component);t.default=Object(u.b)((function(e){return{settings:e.layout.settings}}),{setLayoutSettings:b.d})(B)}}]);
//# sourceMappingURL=94.5a682f9b.chunk.js.map