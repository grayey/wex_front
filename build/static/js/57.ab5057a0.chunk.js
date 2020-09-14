/*! For license information please see 57.ab5057a0.chunk.js.LICENSE.txt */
(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[57],{2263:function(t,e,n){"use strict";n.r(e);var a=n(190),r=n(20),o=n(24),i=n(27),s=n(26),l=n(0),u=n.n(l),d=n(182),c=n(897),p=n.n(c),f=function(t){Object(i.a)(n,t);var e=Object(s.a)(n);function n(){var t;Object(r.a)(this,n);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(t=e.call.apply(e,[this].concat(o))).state={expLeft:!1,expRight:!1,expUp:!1,expDown:!1,expContract:!1,expOverlay:!1,expSlideLeft:!1,expSlideRight:!1,expSlideUp:!1,expSlideDown:!1,expZoomIn:!1,expZoomOut:!1},t.spinnerStyle=[c.EXPAND_LEFT,c.EXPAND_RIGHT,c.EXPAND_UP,c.EXPAND_DOWN,c.CONTRACT,c.SLIDE_LEFT,c.SLIDE_RIGHT,c.SLIDE_UP,c.SLIDE_DOWN,c.ZOOM_IN,c.ZOOM_OUT],t.varianList=["primary","success","warning","info","danger"],t}return Object(o.a)(n,[{key:"toggle",value:function(t){this.setState(Object(a.a)({},t,!this.state[t]))}},{key:"render",value:function(){var t=this;return u.a.createElement("div",null,u.a.createElement(d.a,{routeSegments:[{name:"Home",path:"/"},{name:"Extra Kits",path:"/extra-kits"},{name:"Ladda Buttons"}]}),u.a.createElement(d.h,{title:"basic example",className:"mb-4"},Object.keys(this.state).map((function(e,n){return u.a.createElement(p.a,{key:n,className:"btn btn-".concat(t.varianList[n%5]," border-0 mr-2 mb-2 position-relative"),loading:t.state[e],progress:.5,onClick:function(){return t.toggle(e)},"data-style":t.spinnerStyle[n]},"Submit")}))),u.a.createElement(d.h,{title:"defferent size",className:"mb-4"},u.a.createElement("p",null,"Small Ladda Button"),Object.keys(this.state).map((function(e,n){return u.a.createElement(p.a,{key:n,className:"btn btn-".concat(t.varianList[n%5]," \n              border-0 mr-2 mb-2 btn-sm position-relative"),loading:t.state[e],onClick:function(){return t.toggle(e)},"data-style":t.spinnerStyle[n]},"Submit")})),u.a.createElement("p",null,"Large Ladda Button"),Object.keys(this.state).map((function(e,n){return u.a.createElement(p.a,{key:n,className:"btn btn-".concat(t.varianList[n%5]," \n              border-0 mr-2 mb-2 btn-lg position-relative"),loading:t.state[e],onClick:function(){return t.toggle(e)},"data-style":t.spinnerStyle[n]},"Submit")}))))}}]),n}(l.Component);e.default=f},865:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=e.XS="xs",r=e.S="s",o=e.L="l",i=e.XL="xl",s=(e.SIZES=[a,r,o,i],e.CONTRACT="contract"),l=e.CONTRACT_OVERLAY="contract-overlay",u=e.EXPAND_LEFT="expand-left",d=e.EXPAND_RIGHT="expand-right",c=e.EXPAND_UP="expand-up",p=e.EXPAND_DOWN="expand-down",f=e.SLIDE_LEFT="slide-left",h=e.SLIDE_RIGHT="slide-right",m=e.SLIDE_UP="slide-up",b=e.SLIDE_DOWN="slide-down",g=e.ZOOM_IN="zoom-in",F=e.ZOOM_OUT="zoom-out";e.STYLES=[s,l,u,d,c,p,f,h,m,b,g,F]},897:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(865);Object.keys(a).forEach((function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return a[t]}})}));var r,o=n(898),i=(r=o)&&r.__esModule?r:{default:r};e.default=i.default},898:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}(),o=n(0),i=d(o),s=d(n(2)),l=d(n(899)),u=n(865);function d(t){return t&&t.__esModule?t:{default:t}}function c(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function p(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==typeof e&&"function"!==typeof e?t:e}var f=["loading","progress"],h=function(t){function e(){var t,n,a;c(this,e);for(var r=arguments.length,o=Array(r),i=0;i<r;i++)o[i]=arguments[i];return n=a=p(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(o))),a.setNode=function(t){a.node=t},a.updateLaddaInstance=function(t){t.loading!==a.props.loading&&(t.loading?a.laddaInstance.start():t.disabled?a.laddaInstance.disable():a.laddaInstance.stop()),t.progress!==a.props.progress&&a.laddaInstance.setProgress(t.progress)},p(a,n)}return function(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),r(e,[{key:"componentDidMount",value:function(){this.laddaInstance=l.default.create(this.node),this.props.loading&&this.laddaInstance.start(),"undefined"!==typeof this.props.progress&&this.laddaInstance.setProgress(this.props.progress)}},{key:"componentWillReceiveProps",value:function(t){this.updateLaddaInstance(t)}},{key:"componentWillUnmount",value:function(){this.laddaInstance.remove()}},{key:"render",value:function(){return i.default.createElement("button",a({},function(t,e){var n={};return Object.keys(t).forEach((function(a){-1===e.indexOf(a)&&(n[a]=t[a])})),n}(this.props,f),{className:"ladda-button "+(this.props.className||""),ref:this.setNode,disabled:this.props.disabled||this.props.loading}),i.default.createElement("span",{className:"ladda-label"},this.props.children))}}]),e}(o.Component);h.propTypes={children:s.default.node,className:s.default.string,progress:s.default.number,loading:s.default.bool,disabled:s.default.bool,"data-color":s.default.string,"data-size":s.default.oneOf(u.SIZES),"data-style":s.default.oneOf(u.STYLES),"data-spinner-size":s.default.number,"data-spinner-color":s.default.string,"data-spinner-lines":s.default.number},e.default=h},899:function(t,e,n){!function(e,a){"use strict";t.exports=function(t){var e=[];function n(n){if(void 0!==n){if(/ladda-button/i.test(n.className)||(n.className+=" ladda-button"),n.hasAttribute("data-style")||n.setAttribute("data-style","expand-right"),!n.querySelector(".ladda-label")){var a=document.createElement("span");a.className="ladda-label",r=n,o=a,(i=document.createRange()).selectNodeContents(r),i.surroundContents(o),r.appendChild(o)}var r,o,i,s,l,u=n.querySelector(".ladda-spinner");u||((u=document.createElement("span")).className="ladda-spinner"),n.appendChild(u);var d={start:function(){return s||(s=function(e){var n,a,r=e.offsetHeight;0===r&&(r=parseFloat(window.getComputedStyle(e).height)),r>32&&(r*=.8),e.hasAttribute("data-spinner-size")&&(r=parseInt(e.getAttribute("data-spinner-size"),10)),e.hasAttribute("data-spinner-color")&&(n=e.getAttribute("data-spinner-color")),e.hasAttribute("data-spinner-lines")&&(a=parseInt(e.getAttribute("data-spinner-lines"),10));var o=.2*r;return new t({color:n||"#fff",lines:a||12,radius:o,length:.6*o,width:o<7?2:3,zIndex:"auto",top:"auto",left:"auto",className:""})}(n)),n.disabled=!0,n.setAttribute("data-loading",""),clearTimeout(l),s.spin(u),this.setProgress(0),this},startAfter:function(t){return clearTimeout(l),l=setTimeout((function(){d.start()}),t),this},stop:function(){return d.isLoading()&&(n.disabled=!1,n.removeAttribute("data-loading")),clearTimeout(l),s&&(l=setTimeout((function(){s.stop()}),1e3)),this},toggle:function(){return this.isLoading()?this.stop():this.start()},setProgress:function(t){t=Math.max(Math.min(t,1),0);var e=n.querySelector(".ladda-progress");0===t&&e&&e.parentNode?e.parentNode.removeChild(e):(e||((e=document.createElement("div")).className="ladda-progress",n.appendChild(e)),e.style.width=(t||0)*n.offsetWidth+"px")},enable:function(){return this.stop()},disable:function(){return this.stop(),n.disabled=!0,this},isLoading:function(){return n.hasAttribute("data-loading")},remove:function(){clearTimeout(l),n.disabled=!1,n.removeAttribute("data-loading"),s&&(s.stop(),s=null),e.splice(e.indexOf(d),1)}};return e.push(d),d}console.warn("Ladda button target must be defined.")}function a(t,e){if("function"==typeof t.addEventListener){var a=n(t),r=-1;t.addEventListener("click",(function(){var n,o,i=!0,s=function(t,e){for(;t.parentNode&&t.tagName!==e;)t=t.parentNode;return e===t.tagName?t:void 0}(t,"FORM");if(void 0!==s&&!s.hasAttribute("novalidate"))if("function"==typeof s.checkValidity)i=s.checkValidity();else for(var l=(n=s,o=[],["input","textarea","select"].forEach((function(t){for(var e=n.getElementsByTagName(t),a=0;a<e.length;a++)e[a].hasAttribute("required")&&o.push(e[a])})),o),u=0;u<l.length;u++){var d=l[u],c=d.getAttribute("type");if(""===d.value.replace(/^\s+|\s+$/g,"")&&(i=!1),"checkbox"!==c&&"radio"!==c||d.checked||(i=!1),"email"===c&&(i=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(d.value)),"url"===c&&(i=/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(d.value)),!i)break}i&&(a.startAfter(1),"number"==typeof e.timeout&&(clearTimeout(r),r=setTimeout(a.stop,e.timeout)),"function"==typeof e.callback&&e.callback.apply(null,[a]))}),!1)}}return{bind:function(t,e){var n;if("string"==typeof t)n=document.querySelectorAll(t);else{if("object"!=typeof t)throw new Error("target must be string or object");n=[t]}e=e||{};for(var r=0;r<n.length;r++)a(n[r],e)},create:n,stopAll:function(){for(var t=0,n=e.length;t<n;t++)e[t].stop()}}}(n(900))}()},900:function(t,e,n){var a,r,o;o=function(){"use strict";var t,e,n=["webkit","Moz","ms","O"],a={};function r(t,e){var n,a=document.createElement(t||"div");for(n in e)a[n]=e[n];return a}function o(t){for(var e=1,n=arguments.length;e<n;e++)t.appendChild(arguments[e]);return t}function i(n,r,o,i){var s=["opacity",r,~~(100*n),o,i].join("-"),l=.01+o/i*100,u=Math.max(1-(1-n)/r*(100-l),n),d=t.substring(0,t.indexOf("Animation")).toLowerCase(),c=d&&"-"+d+"-"||"";return a[s]||(e.insertRule("@"+c+"keyframes "+s+"{0%{opacity:"+u+"}"+l+"%{opacity:"+n+"}"+(l+.01)+"%{opacity:1}"+(l+r)%100+"%{opacity:"+n+"}100%{opacity:"+u+"}}",e.cssRules.length),a[s]=1),s}function s(t,e){var a,r,o=t.style;if(void 0!==o[e=e.charAt(0).toUpperCase()+e.slice(1)])return e;for(r=0;r<n.length;r++)if(void 0!==o[a=n[r]+e])return a}function l(t,e){for(var n in e)t.style[s(t,n)||n]=e[n];return t}function u(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)void 0===t[a]&&(t[a]=n[a])}return t}function d(t,e){return"string"==typeof t?t:t[e%t.length]}var c={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:1/4,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};function p(t){this.opts=u(t||{},p.defaults,c)}if(p.defaults={},u(p.prototype,{spin:function(e){this.stop();var n=this,a=n.opts,o=n.el=r(null,{className:a.className});if(l(o,{position:a.position,width:0,zIndex:a.zIndex,left:a.left,top:a.top}),e&&e.insertBefore(o,e.firstChild||null),o.setAttribute("role","progressbar"),n.lines(o,n.opts),!t){var i,s=0,u=(a.lines-1)*(1-a.direction)/2,d=a.fps,c=d/a.speed,p=(1-a.opacity)/(c*a.trail/100),f=c/a.lines;!function t(){s++;for(var e=0;e<a.lines;e++)i=Math.max(1-(s+(a.lines-e)*f)%c*p,a.opacity),n.opacity(o,e*a.direction+u,i,a);n.timeout=n.el&&setTimeout(t,~~(1e3/d))}()}return n},stop:function(){var t=this.el;return t&&(clearTimeout(this.timeout),t.parentNode&&t.parentNode.removeChild(t),this.el=void 0),this},lines:function(e,n){var a,s=0,u=(n.lines-1)*(1-n.direction)/2;function c(t,e){return l(r(),{position:"absolute",width:n.scale*(n.length+n.width)+"px",height:n.scale*n.width+"px",background:t,boxShadow:e,transformOrigin:"left",transform:"rotate("+~~(360/n.lines*s+n.rotate)+"deg) translate("+n.scale*n.radius+"px,0)",borderRadius:(n.corners*n.scale*n.width>>1)+"px"})}for(;s<n.lines;s++)a=l(r(),{position:"absolute",top:1+~(n.scale*n.width/2)+"px",transform:n.hwaccel?"translate3d(0,0,0)":"",opacity:n.opacity,animation:t&&i(n.opacity,n.trail,u+s*n.direction,n.lines)+" "+1/n.speed+"s linear infinite"}),n.shadow&&o(a,l(c("#000","0 0 4px #000"),{top:"2px"})),o(e,o(a,c(d(n.color,s),"0 0 1px rgba(0,0,0,.1)")));return e},opacity:function(t,e,n){e<t.childNodes.length&&(t.childNodes[e].style.opacity=n)}}),"undefined"!==typeof document){e=function(){var t=r("style",{type:"text/css"});return o(document.getElementsByTagName("head")[0],t),t.sheet||t.styleSheet}();var f=l(r("group"),{behavior:"url(#default#VML)"});!s(f,"transform")&&f.adj?function(){function t(t,e){return r("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',e)}e.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(e,n){var a=n.scale*(n.length+n.width),r=2*n.scale*a;function i(){return l(t("group",{coordsize:r+" "+r,coordorigin:-a+" "+-a}),{width:r,height:r})}var s,u=-(n.width+n.length)*n.scale*2+"px",c=l(i(),{position:"absolute",top:u,left:u});function p(e,r,s){o(c,o(l(i(),{rotation:360/n.lines*e+"deg",left:~~r}),o(l(t("roundrect",{arcsize:n.corners}),{width:a,height:n.scale*n.width,left:n.scale*n.radius,top:-n.scale*n.width>>1,filter:s}),t("fill",{color:d(n.color,e),opacity:n.opacity}),t("stroke",{opacity:0}))))}if(n.shadow)for(s=1;s<=n.lines;s++)p(s,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(s=1;s<=n.lines;s++)p(s);return o(e,c)},p.prototype.opacity=function(t,e,n,a){var r=t.firstChild;a=a.shadow&&a.lines||0,r&&e+a<r.childNodes.length&&(r=(r=(r=r.childNodes[e+a])&&r.firstChild)&&r.firstChild)&&(r.opacity=n)}}():t=s(f,"animation")}return p},t.exports?t.exports=o():void 0===(r="function"===typeof(a=o)?a.call(e,n,e,t):a)||(t.exports=r)}}]);
//# sourceMappingURL=57.ab5057a0.chunk.js.map