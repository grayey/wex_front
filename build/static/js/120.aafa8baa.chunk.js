(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[120],{2247:function(t,a,e){"use strict";e.r(a);var n=e(7),i=e(20),s=e(24),r=e(27),l=e(26),d=e(0),c=e.n(d),o=e(1899),u=function(t){Object(r.a)(e,t);var a=Object(l.a)(e);function e(){var t;Object(i.a)(this,e);for(var s=arguments.length,r=new Array(s),l=0;l<s;l++)r[l]=arguments[l];return(t=a.call.apply(a,[this].concat(r))).state={tags:[{id:"USA",text:"USA"},{id:"Germany",text:"Germany"},{id:"Austria",text:"Austria"},{id:"Costa Rica",text:"Costa Rica"},{id:"Sri Lanka",text:"Sri Lanka"},{id:"Thailand",text:"Thailand"}],suggestions:[{id:"USA",text:"USA"},{id:"Germany",text:"Germany"},{id:"Austria",text:"Austria"},{id:"Costa Rica",text:"Costa Rica"},{id:"Sri Lanka",text:"Sri Lanka"},{id:"Thailand",text:"Thailand"}]},t.handleDelete=function(a){var e=t.state.tags;t.setState({tags:e.filter((function(t,e){return e!==a}))})},t.handleAddition=function(a){t.setState((function(t){return{tags:[].concat(Object(n.a)(t.tags),[a])}}))},t.handleDrag=function(a,e,i){if(i){var s=Object(n.a)(t.state.tags);s.splice(e,1),s.splice(i,0,a),t.setState({tags:s})}},t}return Object(s.a)(e,[{key:"render",value:function(){var t=this.state,a=t.tags,e=t.suggestions;return c.a.createElement("div",null,c.a.createElement(o.WithContext,{tags:a,suggestions:e,handleDelete:this.handleDelete,handleAddition:this.handleAddition,handleDrag:this.handleDrag,allowDragDrop:!1,delimiters:[188,13]}))}}]),e}(d.Component);a.default=u}}]);
//# sourceMappingURL=120.aafa8baa.chunk.js.map