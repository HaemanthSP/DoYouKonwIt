(this.webpackJsonpknowit=this.webpackJsonpknowit||[]).push([[0],{60:function(e,t,a){e.exports=a(89)},66:function(e,t,a){},84:function(e,t,a){e.exports=a.p+"static/media/logo.25bf045c.svg"},85:function(e,t,a){},89:function(e,t,a){"use strict";a.r(t);a(61);var n=a(0),s=a.n(n),l=a(7),r=a.n(l),i=(a(66),a(15)),c=a(32),m=a(20),o=a(49),d=a(50),u=a(10),h=a(53),v=a(17),E=a.n(v),g=(a(84),a(85),a(120)),p=a(124),b=a(131),f=a(134),N=a(130),y=a(128),w=a(127),x=a(133),k=a(129),C=a(135),T="134.2.128.120/vocabulary-test/",S=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).signup=function(e){e.preventDefault();var t=a.state,n={firstname:t.firstName,lastname:t.lastName,middlename:t.middleName,role:t.role,teacher:t.teacher,email:t.email,dob:t.dob};a.setState({isLoading:!0});E.a.post("http://"+T+"/api/v1/signup",n,{"Content-Type":"application/json"}).then((function(e){a.setState({activePage:e.data.isValid?"login":"signup",message:e.data.message,isLoading:!1})}))},a.defineExperiment=function(e){e.preventDefault();var t=a.state,n={firstname:t.firstName,lastname:t.lastName,middlename:t.middleName,role:t.role,password:t.password,experiment:t.experiment};a.setState({isLoading:!0});E.a.post("http://"+T+"/api/v1/defineexp",n,{"Content-Type":"application/json"}).then((function(e){a.setState({message:e.data.message,isLoading:!1})}))},a.login=function(e){e.preventDefault();var t=a.state,n={firstname:t.firstName,lastname:t.lastName,middlename:t.middleName,password:t.password};a.setState({isLoading:!0});E.a.post("http://"+T+"/api/v1/login",n,{"Content-Type":"application/json"}).then((function(e){e.data.isValid?"Admin"===e.data.role?a.setState({role:"Admin",activePage:"adminlanding",password:e.data.password,isLoading:!1}):"Teacher"===e.data.role?(a.setState({role:"Teacher",password:e.data.password}),a.getTeacherReport()):a.getTests():a.setState({activePage:"login",message:e.data.message,password:e.data.password,isLoading:!1})}))},a.getLevels=function(e){var t=a.state;a.setState({isLoading:!0});var n={username:t.user};E.a.post("http://"+T+"/api/v1/getlevels",n,{"Content-Type":"application/json"}).then((function(e){a.setState({levels:e.data.levels,isLoading:!1,activePage:"index"})}))},a.getTests=function(e){var t=a.state;a.setState({isLoading:!0});var n={firstname:t.firstName,lastname:t.lastName,middlename:t.middleName,role:t.role,email:t.email,password:t.password,username:t.user};E.a.post("http://"+T+"/api/v1/gettests",n,{"Content-Type":"application/json"}).then((function(e){a.setState({tests:e.data.tests,isLoading:!1,activeTestIndex:e.data.index,wordList:e.data.tests[e.data.index].tokens,activePage:"activity"})}))},a.getWordList=function(e){var t=a.state;a.setState({isLoading:!0});var n={username:t.user};E.a.post("http://"+T+"/api/v1/getwordlist",n,{"Content-Type":"application/json"}).then((function(e){a.setState({wordList:e.data.wordList,activeWordIndex:0,selections:[],isLoading:!1,activePage:"activity",result:{}})}))},a.handleChange=function(e){a.setState(Object(i.a)({},e.target.name,e.target.value))},a.state={user:"Me",tests:[],testsets:[],activeTestIndex:"",wordList:[],activeWordIndex:0,selection:"",selections:[],levels:[],result:{},experiment:"",studentResults:[],teacherReport:[],expName:"",aStudentResult:[],metrics:{},isLoading:!1,activePage:"signup",firstName:"",lastName:"",middleName:"",role:"student",teacher:"",email:"",password:"",dob:"",message:""},a.pages={login:a.renderLogin.bind(Object(u.a)(a)),signup:a.renderSignup.bind(Object(u.a)(a)),landing:a.renderDashboard.bind(Object(u.a)(a)),adminlanding:a.renderAdminDashboard.bind(Object(u.a)(a)),teacherlanding:a.renderTeacherDashboard.bind(Object(u.a)(a)),teacherlanding1:a.renderTeacherDashboard1.bind(Object(u.a)(a)),activity:a.renderActivity.bind(Object(u.a)(a)),index:a.renderIndex.bind(Object(u.a)(a)),level:a.renderLevel.bind(Object(u.a)(a)),report:a.renderReport.bind(Object(u.a)(a)),minireport:a.renderMiniReport.bind(Object(u.a)(a)),score:a.renderScore.bind(Object(u.a)(a)),thankyou:a.renderThankyou.bind(Object(u.a)(a))},a}return Object(h.a)(t,e),Object(m.a)(t,[{key:"getTeacherReport",value:function(){var e=this,t=this.state,a={firstname:t.firstName,lastname:t.lastName,middlename:t.middleName,role:t.role,password:t.password};this.setState({isLoading:!0});E.a.post("http://"+T+"/api/v1/getteacherreport",a,{"Content-Type":"application/json"}).then((function(t){e.setState({message:t.data.message,teacherReport:t.data.teacher_report,isLoading:!1,activePage:"teacherlanding"})}))}},{key:"update",value:function(e){var t=this,a=this.state,n={firstname:a.firstName,lastname:a.lastName,middlename:a.middleName,role:a.role,email:a.email,password:a.password,testcode:this.state.tests[this.state.activeTestIndex].test_code,selections:e};E.a.post("http://"+T+"/api/v1/updateresponse",n,{"Content-Type":"application/json"}).then((function(e){t.setState({message:e.data.message})}))}},{key:"report",value:function(e,t){var a=this,n=this.state,s={firstname:n.firstName,lastname:n.lastName,middlename:n.middleName,role:n.role,email:n.email,password:n.password,selections:e,testcode:this.state.tests[this.state.activeTestIndex].test_code};E.a.post("http://"+T+"/api/v1/getresult",s,{"Content-Type":"application/json"}).then((function(e){a.setState({message:e.data.message,result:e.data.result,activePage:t})}))}},{key:"componentWillMount",value:function(){this.setState({activePage:"signup"}),document.addEventListener("keyup",this.handleKeyPress.bind(this))}},{key:"handleKeyPress",value:function(e){89===e.which?this.selection("yes"):78===e.which&&this.selection("no")}},{key:"selection",value:function(e){if(this.state.activeWordIndex+1<=this.state.wordList.length){var t=this.state.selections.concat(e),a=this.state.activePage;t.length>=this.state.wordList.length&&this.state.wordList.length>0&&(a="score",this.report(t,a)),this.setState({selection:e,activeWordIndex:this.state.activeWordIndex+1,selections:t,activePage:a})}}},{key:"renderLogin",value:function(){var e=this;this.props.classes;return s.a.createElement(g.a,{className:"login_card"},s.a.createElement("div",{className:"switch_container"},s.a.createElement("div",{className:"login_switch",style:{background:"#47d836"},onClick:function(){e.setState({activePage:"signup",message:""})}},"Signup")),s.a.createElement("h1",null,"Login"),s.a.createElement("form",{onSubmit:this.login,style:{marginTop:"30px"}},s.a.createElement("div",null,s.a.createElement("div",{className:"authAlert",style:{color:"blue"}},this.state.message)),s.a.createElement("div",null,s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"firstName",label:"First Name",type:"text",fullWidth:!0,autoFocus:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end",style:{display:"none"}},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"middleName",label:"Middle Name",type:"text",fullWidth:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"lastName",label:"Last Name",type:"text",fullWidth:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"password",label:"Password",type:"password",fullWidth:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,alignItems:"center",justify:"space-between"},s.a.createElement(p.a,{item:!0},s.a.createElement(f.a,{control:s.a.createElement(N.a,{color:"primary"}),label:"Remember me"})),s.a.createElement(p.a,{item:!0},s.a.createElement(y.a,{disableFocusRipple:!0,disableRipple:!0,style:{textTransform:"none"},variant:"text",color:"primary"},"Forgot password ?"))),s.a.createElement(p.a,{container:!0,justify:"center",style:{marginTop:"25px"}},s.a.createElement(y.a,{type:"submit",variant:"outlined",color:"primary",style:{textTransform:"none"}},"Login")))))}},{key:"renderSignup",value:function(){var e=this;return s.a.createElement(g.a,{className:"login_card"},s.a.createElement("div",{className:"switch_container"},s.a.createElement("div",{className:"login_switch",onClick:function(){e.setState({activePage:"login",message:""})}},"Login")),s.a.createElement("h1",null,"Signup"),s.a.createElement("form",{onSubmit:this.signup,style:{marginTop:"30px"}},s.a.createElement("div",null,s.a.createElement("div",{className:"authAlert",style:{color:"red"}},this.state.message)),s.a.createElement("div",null,s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"firstName",label:"First Name",type:"text",fullWidth:!0,autoFocus:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end",style:{display:"none"}},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"middleName",label:"Middle Name",type:"text",fullWidth:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"lastName",label:"Last Name",type:"text",fullWidth:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(w.a,{fullWidth:!0,required:!0},s.a.createElement(x.a,{id:"teachers"},"Teacher"),s.a.createElement(k.a,{labelId:"teachers",name:"teacher",value:this.state.teacher,onChange:this.handleChange},s.a.createElement(C.a,{value:""},s.a.createElement("em",null,"None")),s.a.createElement(C.a,{value:"5e2ebbd9e414a94dc67fd995"},"Bleicher"),s.a.createElement(C.a,{value:"5e3454f8cc0b53337bc5fa13"},"Meurers"),s.a.createElement(C.a,{value:"5e34554acc0b53337bc5fa14"},"Deeg"),s.a.createElement(C.a,{value:"5e2ebbaae414a94dc67fd994"},"Goedicke"))))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"dob",label:"Date of Birth",type:"date",fullWidth:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end",style:{display:"none"}},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"email",label:"E-mail",type:"email",fullWidth:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,justify:"center",style:{marginTop:"20px"}},s.a.createElement(y.a,{type:"submit",variant:"outlined",color:"primary",style:{textTransform:"none"}},"Sign up")),s.a.createElement("div",{className:"card"},"Password: mmddyyyyabc",s.a.createElement("br",null),s.a.createElement("br",null),"for example: ",s.a.createElement("br",null)," Walter White, 15/10/2004 ",s.a.createElement("br",null)," ",s.a.createElement("b",null,"15102004wal")))))}},{key:"renderHeader",value:function(){return s.a.createElement("div",null,s.a.createElement("div",{className:"header"},s.a.createElement("div",null,s.a.createElement("div",{className:"AppName"},"DoYouKnowIt!"),s.a.createElement("div",{className:"username"},this.state.firstName))))}},{key:"renderDashboard",value:function(){return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},s.a.createElement("div",{className:"row"},s.a.createElement("button",{className:"dashboardCard",onClick:this.getLevels},"English vocabulary test "),s.a.createElement("button",{className:"dashboardCard",style:{background:"linear-gradient(45deg, rgb(98, 255, 0), rgba(0, 0, 0, 0.79))"}},"Science MCQs"),s.a.createElement("button",{className:"dashboardCard",style:{background:"linear-gradient(45deg, rgba(224, 106, 23, 0.92), rgba(6, 3, 222, 0.79))"}},"Maths Assignment 01"))))}},{key:"renderAdminDashboard",value:function(){return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"card"},"Choose the testsets within the following range.",s.a.createElement("br",null),"101-120",s.a.createElement("br",null),"201-220",s.a.createElement("br",null),"301-320",s.a.createElement("br",null),"401-420",s.a.createElement("br",null),"501-520",s.a.createElement("br",null),"601-620",s.a.createElement("br",null),s.a.createElement("br",null),"Example: ",s.a.createElement("b",null,"102;201;311;403;514")),s.a.createElement("form",{onSubmit:this.defineExperiment},s.a.createElement(p.a,{container:!0,spacing:8,alignItems:"flex-end"},s.a.createElement(p.a,{item:!0,md:!0,sm:!0,xs:!0},s.a.createElement(b.a,{name:"experiment",label:"Test Sequence",type:"text",fullWidth:!0,autoFocus:!0,required:!0,onChange:this.handleChange}))),s.a.createElement(p.a,{container:!0,justify:"center",style:{marginTop:"20px"}},s.a.createElement(y.a,{type:"submit",variant:"outlined",color:"primary",style:{textTransform:"none"}},"Save"))))))}},{key:"renderTeacherDashboard",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},s.a.createElement("div",{className:"row"},this.state.teacherReport.map((function(t,a){return s.a.createElement("div",{className:"card level_card",onClick:function(){e.setState({tests:t.tests,studentResults:t.results,expName:t.definition,activePage:"teacherlanding1"})}},t.definition)})))))}},{key:"renderScoreCell",value:function(e){var t=this;return s.a.createElement("div",{className:"col-lg-9 row"},e.map((function(a,n){return s.a.createElement("div",{className:"scoreCell card",style:{width:(100/e.length).toString()+"%",background:(l=a.metrics.score,["#c50000a8","#c42a00a8","#c35400a8","#c27d00a8","#c1a600a8","#b2c000a8","#88bf00a8","#5fbe00a8","#36bd00a8","#0dbc00a8","#00bb1ba8","#00bb1ba8"][Math.floor(l/10)])},onClick:function(){t.setState({wordList:t.state.tests[n].tokens,metrics:a.metrics,selections:a.evaluated_responses,activePage:"report"})}},a.metrics.score);var l})))}},{key:"renderResultTableEntry",value:function(){var e=this;return s.a.createElement("div",null,this.state.studentResults.map((function(t,a){return s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"scoreRow col-lg-3 card"},t.name),e.renderScoreCell(t.result))})))}},{key:"renderResultTableHeader",value:function(){var e=this;return s.a.createElement("div",null,s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"scoreRow col-lg-3 card"},"Name"),s.a.createElement("div",{className:"col-lg-9 row"},this.state.studentResults[0].result.map((function(t,a){return s.a.createElement("div",{className:"scoreCell card",style:{width:(100/e.state.studentResults[0].result.length).toString()+"%"}},t.test_code[5],"\u2606")})))))}},{key:"renderTeacherDashboard1",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},this.renderResultTableHeader(),this.renderResultTableEntry(),s.a.createElement("div",{className:"row"},s.a.createElement("button",{className:"button back",onClick:function(){e.setState({activePage:"teacherlanding"})}}," \u21a9 "))))}},{key:"renderActivity",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"checkout-wrap"},s.a.createElement("ul",{className:"checkout-bar"},this.state.tests.map((function(t,a){return s.a.createElement("li",{style:{width:(a!==e.state.activeTestIndex?6:100-6*(e.state.tests.length-1)).toString()+"%"},className:a===e.state.activeTestIndex?"active":a<e.state.activeTestIndex?"visited":""}," ",t.test_code[5],"\u2606")})))),s.a.createElement("div",{className:"content"},s.a.createElement("div",{id:"progressbar"},s.a.createElement("div",{style:{width:this.state.activeWordIndex/this.state.wordList.length*100+"%"}})),s.a.createElement("h1",{className:"word"}," ",this.state.wordList[this.state.activeWordIndex]," "),s.a.createElement("div",{className:"col-md-12"},s.a.createElement("div",{className:"row card_ctr"},s.a.createElement("button",{className:"button option green",onClick:function(){e.selection("yes")}}," known (Y) "),s.a.createElement("button",{className:"button option red",onClick:function(){e.selection("no")}}," unknown (N) ")))))}},{key:"renderIndex",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},s.a.createElement("h1",{style:{marginBottom:30}}," Levels "),s.a.createElement("div",{className:"row"},this.state.levels.map((function(t,a){return s.a.createElement("div",{className:"column",key:a},s.a.createElement("div",{className:"card level_card",style:{borderRadius:10},onClick:function(){e.setState({testsets:t.testsets,activePage:"level"})}},t.level))})))))}},{key:"renderLevel",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},s.a.createElement("h1",{style:{marginBottom:30}}," Testsets "),s.a.createElement("div",{className:"row"},this.state.testsets.map((function(t,a){return s.a.createElement("div",{className:"column",key:a},s.a.createElement("div",{className:"card testset_card",style:{borderRadius:10},onClick:function(){e.setState({wordList:t.tokens,activePage:"activity"})}}," ",t.test_code))}))),s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("div",{className:"row"},s.a.createElement("button",{className:"button back",onClick:function(){e.setState({activePage:"index"})}}," \u21a9 "))))}},{key:"nextTest",value:function(){var e=this.state.activeTestIndex+1;e<this.state.tests.length?this.setState({activeTestIndex:e,wordList:this.state.tests[e].tokens,activeWordIndex:0,selection:"",selections:[],levels:[],result:{},activePage:"activity"}):this.setState({activeTestIndex:0,activeWordIndex:0,selection:"",selections:[],levels:[],result:{},activePage:"thankyou"})}},{key:"renderThankyou",value:function(){return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"content"},s.a.createElement("div",{className:"thankyou"},"Thank You !!!")))}},{key:"renderReport",value:function(){var e=this;return s.a.createElement("div",null,s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("h1",null," Report "),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"column"},s.a.createElement("div",{className:"card",style:{borderRadius:10}},s.a.createElement("h4",null,"Hits"),s.a.createElement("br",null),s.a.createElement("h2",null,this.state.metrics.hits))),s.a.createElement("div",{className:"column"},s.a.createElement("div",{className:"card",style:{borderRadius:10}},s.a.createElement("h4",null,"False Hits"),s.a.createElement("br",null),s.a.createElement("h2",null,this.state.metrics.false_hits))),s.a.createElement("div",{className:"column"},s.a.createElement("div",{className:"card",style:{borderRadius:10}},s.a.createElement("h4",null,"Score"),s.a.createElement("br",null),s.a.createElement("h2",null,this.state.metrics.score)))),s.a.createElement("div",{className:"row"},this.state.wordList.map((function(t,a){return s.a.createElement("div",{className:"column col-md-3 col-sm-4",key:a},e.renderReportCard(a,t))}))),s.a.createElement("div",{className:"row"},s.a.createElement("button",{className:"button back",onClick:function(){e.setState({activePage:"teacherlanding1"})}}," \u21a9 ")),s.a.createElement("br",null),s.a.createElement("br",null))}},{key:"renderMiniReport",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"checkout-wrap"},s.a.createElement("ul",{className:"checkout-bar"},this.state.tests.map((function(t,a){return s.a.createElement("li",{style:{width:(a!==e.state.activeTestIndex?6:100-6*(e.state.tests.length-1)).toString()+"%"},className:a===e.state.activeTestIndex?"active":a<e.state.activeTestIndex?"visited":""}," ",t.test_code[5],"\u2606")})))),s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"column"},s.a.createElement("div",{className:"card",style:{borderRadius:10}},s.a.createElement("h4",null,"Hits"),s.a.createElement("br",null),s.a.createElement("h2",null,this.state.result.hits))),s.a.createElement("div",{className:"column"},s.a.createElement("div",{className:"card",style:{borderRadius:10}},s.a.createElement("h4",null,"False Hits"),s.a.createElement("br",null),s.a.createElement("h2",null,this.state.result.false_hits)))),s.a.createElement("div",{className:"row"},s.a.createElement("button",{style:{borderRadius:10},onClick:function(){e.nextTest()}}," Next ",this.state.activeTestIndex+1," ")))}},{key:"renderScore",value:function(){var e=this;return s.a.createElement("div",{className:"canvas"},this.renderHeader(),s.a.createElement("div",{className:"checkout-wrap"},s.a.createElement("ul",{className:"checkout-bar"},this.state.tests.map((function(t,a){return s.a.createElement("li",{style:{width:(a!==e.state.activeTestIndex?6:100-6*(e.state.tests.length-1)).toString()+"%"},className:a===e.state.activeTestIndex?"active":a<e.state.activeTestIndex?"visited":""}," ",t.test_code[5],"\u2606")})))),s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("div",{className:"scoreboard"},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"scorecard"},this.state.result.score,"%")),s.a.createElement("div",null,s.a.createElement("div",{className:"scoreFeedback"},this.state.result.message)),s.a.createElement("div",{className:"row"},s.a.createElement("button",{className:"button",style:{borderRadius:10,margin:"40px auto"},onClick:function(){e.nextTest()}}," Next "))))}},{key:"renderReportCard",value:function(e,t){var a,n=this.state.selections[e],l="black";return"yes"===n?a="#01a22b88":"wrong"===n?a="#c51a0988":"unknown"===n?(a="#004cc5bb",l="white"):(a="grey",l="white"),s.a.createElement("div",{className:"card report_card",style:{color:l,background:a}},s.a.createElement("h4",{style:{textAlign:"center",display:"table-cell"}},t))}},{key:"render",value:function(){return s.a.createElement("div",{className:"container"},this.pages[this.state.activePage](),this.state.isLoading?s.a.createElement("div",{className:"overlay"},s.a.createElement("div",{className:"lds-roller"},s.a.createElement("div",null),s.a.createElement("div",null),s.a.createElement("div",null),s.a.createElement("div",null),s.a.createElement("div",null))):null)}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[60,1,2]]]);
//# sourceMappingURL=main.4c3511fd.chunk.js.map