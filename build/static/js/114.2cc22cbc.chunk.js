(this["webpackJsonpgull-react"]=this["webpackJsonpgull-react"]||[]).push([[114],{2241:function(e,a,t){"use strict";t.r(a);var l=t(20),r=t(24),n=t(27),m=t(26),c=t(0),o=t.n(c),i=t(1838),s=t.n(i),d=t(1022),u=t(852),h=t(182),p=t(863),b=t(862),E=t(1892),N=function(e){Object(n.a)(t,e);var a=Object(m.a)(t);function t(){var e;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),m=0;m<r;m++)n[m]=arguments[m];return(e=a.call.apply(a,[this].concat(n))).state={firstName:"",lastName:"",phone:"",select:"",birthDay:"",cardNumber:"4444444444444444",email:"",password:"",repassword:"",website:"",switch:!1,checkbox1:"",checkbox2:"",radio:"",range:{startDate:new Date,endDate:function(){var e=new Date;return e.setDate(e.getDate()+7),e}()}},e.handleSubmit=function(e,a){a.setSubmitting;console.log(e)},e.handleDateRangeChange=function(a){var t=a.startDate,l=a.endDate;e.setState({range:{startDate:t.toDate(),endDate:l.toDate()}})},e}return Object(r.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement("div",null,o.a.createElement(h.a,{routeSegments:[{name:"Forms",path:"/forms"},{name:"Basic Form"}]}),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"card mb-4"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"card-title mb-3"},"Form Inputs"),o.a.createElement(p.b,{initialValues:this.state,validationSchema:f,onSubmit:this.handleSubmit},(function(a){var t=a.values,l=a.errors,r=a.touched,n=a.handleChange,m=a.handleBlur,c=a.handleSubmit;a.isSubmitting;return o.a.createElement("form",{onSubmit:c},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"firstName"},"First name"),o.a.createElement("input",{id:"firstName",name:"firstName",className:"form-control",placeholder:"Enter your first name",type:"text",onChange:n,onBlur:m,value:t.firstName}),l.firstName&&r.firstName&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.firstName)),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"lastName"},"Last name"),o.a.createElement("input",{id:"lastName",name:"lastName",className:"form-control",placeholder:"Enter your last name",type:"text",onChange:n,onBlur:m,value:t.lastName}),l.lastName&&r.lastName&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.lastName)),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"email"},"Email address"),o.a.createElement("input",{name:"email",id:"email",className:"form-control",placeholder:"xox@xmail.com",type:"email",onChange:n,onBlur:m,value:t.email}),l.email&&r.email&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.email),o.a.createElement("small",{id:"emailHelp",className:"form-text text-muted"},"We'll never share your email with anyone else.")),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"phone"},"Phone"),o.a.createElement("input",{className:"form-control",id:"phone",name:"phone",placeholder:"Enter phone",type:"text",onChange:n,onBlur:m,value:t.phone}),l.phone&&r.phone&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.phone)),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"cardNumber"},"Cradit card number"),o.a.createElement("input",{className:"form-control",id:"cardNumber",name:"cardNumber",placeholder:"4444-4444-4444-4444",type:"number",onChange:n,onBlur:m,value:t.cardNumber}),l.cardNumber&&r.cardNumber&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.cardNumber)),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"website"},"Website"),o.a.createElement("input",{className:"form-control",id:"website",name:"website",placeholder:"Web address",onChange:n,onBlur:m})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"picker2"},"Birth date"),o.a.createElement(s.a,{name:"birthDay",onChange:function(e){n({target:{name:"birthDay",value:e.toDate()}})}}),l.birthDay&&r.birthDay&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.birthDay)),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"picker1"},"Select"),o.a.createElement("select",{id:"picker1",className:"form-control",name:"select",value:t.select,onChange:n,onBlur:m},o.a.createElement("option",{value:"opt1"},"Option 1"),o.a.createElement("option",{value:"opt2"},"Option 2"),o.a.createElement("option",{value:"opt3"},"Option 3")),l.select&&r.select&&o.a.createElement("div",{className:"text-danger mt-1 ml-2"},l.select)),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement(d.a.Check,{name:"switch",onChange:n,value:t.switch,type:"switch",id:"custom-switch",label:"I accept the terms & conditions"}),o.a.createElement(d.a.Check,{name:"checkbox1",onChange:n,value:"check123",checked:t.checkbox1&&t.checkbox1.includes("check123"),type:"checkbox",id:"check1",label:"I accept the policies"}),o.a.createElement(d.a.Check,{name:"checkbox2",onChange:n,value:"check321",checked:t.checkbox2&&t.checkbox2.includes("check321"),type:"checkbox",id:"check2",label:"Subscribe for future news letters"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("fieldset",{onChange:n},o.a.createElement(d.a.Group,null,o.a.createElement(d.a.Label,{as:"legend"},"Choose any option"),o.a.createElement(d.a.Check,{type:"radio",label:"first radio",name:"radio",id:"formHorizontalRadios1",value:"radio1"}),o.a.createElement(d.a.Check,{type:"radio",label:"second radio",name:"radio",id:"formHorizontalRadios2",value:"radio2"}),o.a.createElement(d.a.Check,{type:"radio",label:"third radio",name:"radio",id:"formHorizontalRadios3",value:"radio3"})))),o.a.createElement("div",{className:"col-md-12 form-group mb-3"},o.a.createElement("label",{htmlFor:"picker2"},"Birth date"),o.a.createElement(E.DateRange,{startDate:new Date(e.state.range.startDate).toLocaleDateString("en-GB"),endDate:new Date(e.state.range.endDate).toLocaleDateString("en-GB"),onChange:e.handleDateRangeChange})),o.a.createElement("div",{className:"col-md-12"},o.a.createElement(u.a,{type:"submit"},"Submit"))))})),o.a.createElement(h.b,{language:"xml"},'<form>\n  <div className="row">\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="firstName1">First name</label>\n      <input\n        type="text"\n        className="form-control"\n        id="firstName1"\n        placeholder="Enter your first name"\n      />\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="lastName1">Last name</label>\n      <input\n        type="text"\n        className="form-control"\n        id="lastName1"\n        placeholder="Enter your last name"\n      />\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="exampleInputEmail1">Email address</label>\n      <input\n        type="email"\n        className="form-control"\n        id="exampleInputEmail1"\n        placeholder="Enter email"\n      />\n      <small id="emailHelp" className="form-text text-muted">\n        We\'ll never share your email with anyone else.\n      </small>\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="phone">Phone</label>\n      <input\n        className="form-control"\n        id="phone"\n        placeholder="Enter phone"\n      />\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="credit1">Cradit card number</label>\n      <input\n        className="form-control"\n        id="credit1"\n        placeholder="Card"\n      />\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="website">Website</label>\n      <input\n        className="form-control"\n        id="website"\n        placeholder="Web address"\n      />\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="picker2">Birth date</label>\n      <DateTime />\n    </div>\n\n    <div className="col-md-6 form-group mb-3">\n      <label htmlFor="picker1">Select</label>\n      <select className="form-control">\n        <option>Option 1</option>\n        <option>Option 1</option>\n        <option>Option 1</option>\n      </select>\n    </div>\n\n    <div className="col-md-12">\n      <button className="btn btn-primary">Submit</button>\n    </div>\n  </div>\n</form>')))),o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"card mb-4"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"card-title mb-3"},"Form Inputs Rounded"),o.a.createElement("form",null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"firstName2"},"First name"),o.a.createElement("input",{type:"text",className:"form-control form-control-rounded",id:"firstName2",placeholder:"Enter your first name"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"lastName2"},"Last name"),o.a.createElement("input",{type:"text",className:"form-control form-control-rounded",id:"lastName2",placeholder:"Enter your last name"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"exampleInputEmail2"},"Email address"),o.a.createElement("input",{type:"email",className:"form-control form-control-rounded",id:"exampleInputEmail2",placeholder:"Enter email"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"phone1"},"Phone"),o.a.createElement("input",{className:"form-control form-control-rounded",id:"phone1",placeholder:"Enter phone"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"credit2"},"Cradit card number"),o.a.createElement("input",{className:"form-control form-control-rounded",id:"credit2",placeholder:"Card"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"website2"},"Website"),o.a.createElement("input",{className:"form-control form-control-rounded",id:"website2",placeholder:"Web address"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"picker3"},"Birth date"),o.a.createElement(s.a,{className:"form-control-rounded"})),o.a.createElement("div",{className:"col-md-6 form-group mb-3"},o.a.createElement("label",{htmlFor:"picker1"},"Select"),o.a.createElement("select",{className:"form-control form-control-rounded"},o.a.createElement("option",null,"Option 1"),o.a.createElement("option",null,"Option 1"),o.a.createElement("option",null,"Option 1"))),o.a.createElement("div",{className:"col-md-12"},o.a.createElement("button",{className:"btn btn-primary"},"Submit"))))))),o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"card mb-4"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"card-title"},"Switch"),o.a.createElement(d.a,null,o.a.createElement(d.a.Check,{type:"switch",id:"custom-switch 5",label:"Check this switch"}),o.a.createElement(d.a.Check,{disabled:!0,type:"switch",label:"disabled switch",id:"disabled-custom-switch"})),o.a.createElement(h.b,{language:"xml"},'<Form>\n  <Form.Check\n    type="switch"\n    id="custom-switch"\n    label="Check this switch"\n  />\n  <Form.Check\n    disabled\n    type="switch"\n    label="disabled switch"\n    id="disabled-custom-switch"\n  />\n</Form>'))))))}}]),t}(c.Component),f=b.object().shape({firstName:b.string().required("first name is required"),lastName:b.string().required("last name is required"),phone:b.string().required("select any option"),select:b.string().required("select any option"),birthDay:b.string().required("birthDay is required"),cardNumber:b.number().test("card-validator","Invlid card",(function(e){return!e||16===e.toString().length})).required("Card number is required"),email:b.string().email("Invalid email").required("email is required"),checkbox1:b.string().required("Required"),checkbox2:b.string().required("Required"),switch:b.string().required("Required")});a.default=N}}]);
//# sourceMappingURL=114.2cc22cbc.chunk.js.map