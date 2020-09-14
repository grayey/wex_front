(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[81],{2332:function(e,a,t){"use strict";t.r(a);var s=t(20),o=t(24),r=t(27),n=t(26),l=t(0),i=t.n(l),c=t(182),m=t(864),p=t(834),d=t(896),h=t.n(d),u={chart:{height:350,type:"bar"},plotOptions:{bar:{horizontal:!1,endingShape:"rounded",columnWidth:"55%"}},dataLabels:{enabled:!1},stroke:{show:!0,width:2,colors:["transparent"],lineCap:"round"},series:[{name:"Net Profit",data:[44,55,57,56,61,58,63,60,66]},{name:"Revenue",data:[76,85,101,98,87,105,91,114,94]},{name:"Free Cash Flow",data:[35,41,36,26,45,48,52,53,41]}],xaxis:{categories:["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"]},yaxis:{title:{text:"$ (thousands)"}},fill:{opacity:1},tooltip:{y:{formatter:function(e){return"$ "+e+" thousands"}}}},f={chart:{height:350,type:"bar",toolbar:{show:!1}},plotOptions:{bar:{dataLabels:{position:"top"},endingShape:"rounded"}},colors:["#03A9F4"],dataLabels:{enabled:!0,formatter:function(e){return e+"%"},offsetY:-20,style:{fontSize:"12px",colors:["#333"]}},series:[{name:"Inflation",data:[2.3,3.1,4,10.1,4,3.6,3.2,2.3,1.4,.8,.5,.2]}],xaxis:{categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],position:"top",labels:{offsetY:-18},axisBorder:{show:!1},axisTicks:{show:!1},tooltip:{enabled:!0,offsetY:-35}},fill:{gradient:{shade:"light",type:"horizontal",shadeIntensity:.25,gradientToColors:"#639",inverseColors:!0,opacityFrom:1,opacityTo:1,stops:[50,0,100,100]}},yaxis:{axisBorder:{show:!1},axisTicks:{show:!1},labels:{show:!1,formatter:function(e){return e+"%"}}},title:{text:"Monthly Inflation in Argentina, 2002",floating:!0,offsetY:320,align:"center",style:{color:"#444"}}},b={chart:{height:350,type:"bar",stacked:!0,toolbar:{show:!1},zoom:{enabled:!1}},responsive:[{breakpoint:480,options:{legend:{position:"bottom",offsetX:-10,offsetY:0}}}],plotOptions:{bar:{horizontal:!1}},series:[{name:"PRODUCT A",data:[44,55,41,67,22,43]},{name:"PRODUCT B",data:[13,23,20,8,13,27]},{name:"PRODUCT C",data:[11,17,15,15,21,14]},{name:"PRODUCT D",data:[21,7,25,13,22,8]}],xaxis:{type:"datetime",categories:["01/01/2011 GMT","01/02/2011 GMT","01/03/2011 GMT","01/04/2011 GMT","01/05/2011 GMT","01/06/2011 GMT"]},legend:{position:"top"},fill:{opacity:1}},y={chart:{height:350,type:"bar",toolbar:{show:!1}},plotOptions:{bar:{colors:{ranges:[{from:-100,to:-46,color:"#F15B46"},{from:-45,to:0,color:"#FEB019"}]},columnWidth:"80%",endingShape:"rounded"}},dataLabels:{enabled:!1},series:[{name:"Cash Flow",data:[1.45,5.42,5.9,-.42,-12.6,-18.1,-18.2,-14.16,-11.1,-6.09,.34,3.88,13.07,5.8,2,7.37,8.1,13.57,15.75,17.1,19.8,-27.03,-54.4,-47.2,-43.3,-18.6,-48.6,-41.1,-39.6,-37.6,-29.4,-21.4,-2.4]}],yaxis:{title:{text:"Growth"},labels:{formatter:function(e){return e.toFixed(0)+"%"}}},xaxis:{categories:["2011-01-01","2011-02-01","2011-03-01","2011-04-01","2011-05-01","2011-06-01","2011-07-01","2011-08-01","2011-09-01","2011-10-01","2011-11-01","2011-12-01","2012-01-01","2012-02-01","2012-03-01","2012-04-01","2012-05-01","2012-06-01","2012-07-01","2012-08-01","2012-09-01","2012-10-01","2012-11-01","2012-12-01","2013-01-01","2013-02-01","2013-03-01","2013-04-01","2013-05-01","2013-06-01","2013-07-01","2013-08-01","2013-09-01"],labels:{rotate:-90}},tooltip:{}},g=["#008FFB","#00E396","#FEB019","#FF4560","#775DD0","#546E7A","#26a69a","#D10CE8"],x={chart:{height:350,type:"bar",events:{click:function(e,a,t){console.log(e,a,t)}}},colors:g,plotOptions:{bar:{columnWidth:"45%",distributed:!0,endingShape:"rounded"}},dataLabels:{enabled:!1},series:[{data:[21,22,10,28,16,21,13,30]}],xaxis:{categories:["John","Joe","Jake","Amber","Peter","Mary","David","Lily"],labels:{style:{colors:g,fontSize:"14px"}}}},v=function(e){Object(r.a)(t,e);var a=Object(n.a)(t);function t(){var e;Object(s.a)(this,t);for(var o=arguments.length,r=new Array(o),n=0;n<o;n++)r[n]=arguments[n];return(e=a.call.apply(a,[this].concat(r))).state={},e}return Object(o.a)(t,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(c.a,{routeSegments:[{name:"Charts",path:"/charts"},{name:"Apex",path:"/apex"},{name:"Column Chart"}]}),i.a.createElement(m.a,null,i.a.createElement(p.a,{lg:6,md:6,sm:12,xs:12,className:"mb-4"},i.a.createElement(c.h,{className:"h-100",title:"Basic Column chart"},i.a.createElement(h.a,{options:u,series:u.series,type:u.chart.type}))),i.a.createElement(p.a,{lg:6,md:6,sm:12,xs:12,className:"mb-4"},i.a.createElement(c.h,{className:"h-100",title:"Column with Data Labels"},i.a.createElement(h.a,{options:f,series:f.series,type:f.chart.type}))),i.a.createElement(p.a,{lg:6,md:6,sm:12,xs:12,className:"mb-4"},i.a.createElement(c.h,{className:"h-100",title:"Stacked Columns"},i.a.createElement(h.a,{options:b,series:b.series,type:b.chart.type}))),i.a.createElement(p.a,{lg:6,md:6,sm:12,xs:12,className:"mb-4"},i.a.createElement(c.h,{className:"h-100",title:"Column with Negative Values"},i.a.createElement(h.a,{options:y,series:y.series,type:y.chart.type}))),i.a.createElement(p.a,{lg:6,md:6,sm:12,xs:12,className:"mb-4"},i.a.createElement(c.h,{className:"h-100",title:"Distributed Columns"},i.a.createElement(h.a,{options:x,series:x.series,type:x.chart.type})))))}}]),t}(l.Component);a.default=v},834:function(e,a,t){"use strict";var s=t(4),o=t(10),r=t(6),n=t.n(r),l=t(0),i=t.n(l),c=t(52),m=["xl","lg","md","sm","xs"],p=i.a.forwardRef((function(e,a){var t=e.bsPrefix,r=e.className,l=e.as,p=void 0===l?"div":l,d=Object(o.a)(e,["bsPrefix","className","as"]),h=Object(c.a)(t,"col"),u=[],f=[];return m.forEach((function(e){var a,t,s,o=d[e];if(delete d[e],"object"===typeof o&&null!=o){var r=o.span;a=void 0===r||r,t=o.offset,s=o.order}else a=o;var n="xs"!==e?"-"+e:"";a&&u.push(!0===a?""+h+n:""+h+n+"-"+a),null!=s&&f.push("order"+n+"-"+s),null!=t&&f.push("offset"+n+"-"+t)})),u.length||u.push(h),i.a.createElement(p,Object(s.a)({},d,{ref:a,className:n.a.apply(void 0,[r].concat(u,f))}))}));p.displayName="Col",a.a=p},864:function(e,a,t){"use strict";var s=t(4),o=t(10),r=t(6),n=t.n(r),l=t(0),i=t.n(l),c=t(52),m=["xl","lg","md","sm","xs"],p=i.a.forwardRef((function(e,a){var t=e.bsPrefix,r=e.className,l=e.noGutters,p=e.as,d=void 0===p?"div":p,h=Object(o.a)(e,["bsPrefix","className","noGutters","as"]),u=Object(c.a)(t,"row"),f=u+"-cols",b=[];return m.forEach((function(e){var a,t=h[e];delete h[e];var s="xs"!==e?"-"+e:"";null!=(a=null!=t&&"object"===typeof t?t.cols:t)&&b.push(""+f+s+"-"+a)})),i.a.createElement(d,Object(s.a)({ref:a},h,{className:n.a.apply(void 0,[r,u,l&&"no-gutters"].concat(b))}))}));p.displayName="Row",p.defaultProps={noGutters:!1},a.a=p}}]);
//# sourceMappingURL=81.160d537e.chunk.js.map