import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Select, FormControl, InputLabel, MenuItem} from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    }
});

// var HOST = '134.2.128.120/vocabulary-test/' 
var HOST = '127.0.0.1:8080' 

class App extends Component {
     constructor(props) {
        super(props);
        this.state = {
            user: "Me",

            // Test session
            tests: [],
            testsets: [],
            activeTestIndex: '',

            // For each test
            wordList: [],
            activeWordIndex: 0,
            selection: "",
            selections: [],
            levels: [],
            result: {},

      			// Admin exp
            experiment: "",
            
            // Teacher
            studentResults: [],
            teacherReport: [],
            expName: "",
            aStudentResult: [],
            metrics: {},

            // UI Handling
            isLoading: false,
            activePage: "signup",

            // Login details
            firstName: "",
            lastName: "",
            middleName: "",
			      role: "student",
            teacher: "",
            email: "",
            password: "",
            dob: "",
            message: "",
            
            // User maintenance
            userList: [],
        };

      this.pages = {
         "login": this.renderLogin.bind(this),
         "signup": this.renderSignup.bind(this),
         "landing": this.renderDashboard.bind(this),
         "instructions": this.renderInstructions.bind(this),
         "adminlanding": this.renderAdminDashboard.bind(this),
         "teacherlanding": this.renderTeacherDashboard.bind(this),
         "teacherlanding1": this.renderTeacherDashboard1.bind(this),
         "activity": this.renderActivity.bind(this),
         "index": this.renderIndex.bind(this),
         "level": this.renderLevel.bind(this),
         "report": this.renderReport.bind(this),
         "minireport": this.renderMiniReport.bind(this),
         "score": this.renderScore.bind(this),
         "thankyou": this.renderThankyou.bind(this),
      }; 
   }

  signup = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      teacher: stateData.teacher,
      email: stateData.email,
      dob: stateData.dob
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/signup', user, config)
      .then(response => {
        this.setState({activePage: response.data.isValid ? "login" : 'signup',
					   message: response.data.message,
                       isLoading: false})
      })
  }

  adduser = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      teacher: stateData.teacher,
      email: stateData.email,
      dob: stateData.dob,
      password: stateData.password
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/adduser', user, config)
      .then(response => {
        this.setState({activePage: 'adminlanding',
                       message: response.data.message,
                       userList: response.data.user_list, 
                       isLoading: false})
      })
  }

  removeuser(uid) {
    const user = {
      uid: uid,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/removeuser', user, config)
      .then(response => {
        this.setState({message: response.data.message,
                       userList: response.data.user_list,
                       isLoading: false})
      })
  }

  userList = event => {
    const user = {
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/userList', user, config)
      .then(response => {
        this.setState({message: response.data.message,
                       userList: response.data.user_list,
                       isLoading: false})
      })
  }

  defineExperiment = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      password: stateData.password,
      experiment: stateData.experiment,
      expName : stateData.expName
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/defineexp', user, config)
      .then(response => {
        this.setState({message: response.data.message,
                       isLoading: false})
      })
  }
  
  login = event => {
    event.preventDefault();
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      password: stateData.password
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/login', user, config)
      .then(response => {
	  if (response.data.isValid) {
		  if (response.data.role === 'Admin') {
           let stateData = this.state;
           const user = {
           };
           this.setState({ isLoading: true })
           let config = { "Content-Type": "application/json" };
           axios.post('http://' + HOST + '/api/v1/experiments', user, config)
             .then(response => {
         	    this.setState({role: 'Admin',
       			    	           activePage: 'adminlanding',
                             password: response.data.password,
                             experiments: response.data.experiments,
                             userList: response.data.user_list,
       			            	   isLoading: false});
             })
         }
      else if(response.data.role === 'Teacher') {
        this.setState({
          role: 'Teacher',
          password: response.data.password,
        });
        this.getTeacherReport();
      }
	    else {
	  	  this.getTests();
      }
		}
	  else {
        this.setState({
			// activePage: response.data.isValid ? 'activity': 'login',
			activePage: 'login',
			message: response.data.message,
            password: response.data.password,
            isLoading: false});
	    }
      })
  }


  getTeacherReport() {
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      password: stateData.password,
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/getteacherreport', user, config)
      .then(response => {
        this.setState({message: response.data.message,
                       teacherReport: response.data.teacher_report,
                       isLoading: false,
                       activePage: 'teacherlanding'
                       })
      })
  }
  
  update(selections) {
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      email: stateData.email,
      password: stateData.password,
      testcode: this.state.tests[this.state.activeTestIndex]['test_code'],
      selections: selections
    };
    // this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/updateresponse', user, config)
      .then(response => {
        this.setState({message: response.data.message
                       })
      })
  }

  download = event => {
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      email: stateData.email,
      password: stateData.password,
      exp_id: stateData.expId,
      teacher_id: stateData.teacher
    };
    // this.setState({ isLoading: true })
    // let config = { "Content-Type": "application/zip" };
    let config = { "Content-Type": "application/force-download" };
    axios.get('http://' + HOST + '/api/v1/export', user, config)
      .then(response => {
        this.setState({message: 'Done'})
      })
  }

  report(selections, page) {
    let stateData = this.state;
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      email: stateData.email,
      password: stateData.password,
      selections: selections,
      testcode: this.state.tests[this.state.activeTestIndex]['test_code'],
    };
    // this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/getresult', user, config)
      .then(response => {
        this.setState({message: response.data.message,
                       result: response.data.result,
                       activePage: page
            })
      })
  }

  getLevels = (event) => {
    let stateData = this.state;
    this.setState({ isLoading: true })
    const user = {
      username: stateData.user,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/getlevels', user, config)
      .then(response => {
        this.setState({
          levels: response.data.levels,
          isLoading: false,
          activePage: "index",
        })
      })
  }

  getTests = (event) => {
    let stateData = this.state;
    this.setState({ isLoading: true })
    const user = {
      firstname: stateData.firstName,
      lastname: stateData.lastName,
      middlename: stateData.middleName,
      role: stateData.role,
      email: stateData.email,
      password: stateData.password,
      username: stateData.user,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/gettests', user, config)
      .then(response => {
        this.setState({
          tests: response.data.tests,
          isLoading: false,
          activeTestIndex: response.data.index,
          wordList: response.data.tests[response.data.index]['tokens'],
          // activePage: "activity"
          activePage: "instructions"
        })
      })
  }

  getWordList = (event) => {
    let stateData = this.state;
    this.setState({ isLoading: true })
    const user = {
      username: stateData.user,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + '/api/v1/getwordlist', user, config)
      .then(response => {
        this.setState({
          wordList: response.data.wordList,
          activeWordIndex: 0,
          selections: [],
          isLoading: false,
          activePage: "activity",
          result: {}
        })
      })
  }

  componentWillMount() {
    this.setState({activePage: 'signup'});
    document.addEventListener("keyup", this.handleKeyPress.bind(this));
  }

  handleKeyPress (e) {
    if (e.which === 89) { 
       this.selection("yes")
    }
    else if (e.which === 78) {
       this.selection("no")
    }
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  selection (choice) {
	if (this.state.activeWordIndex + 1 <= this.state.wordList.length) {
    var joined = this.state.selections.concat(choice);
    var page = this.state.activePage
    if(joined.length >= this.state.wordList.length && this.state.wordList.length > 0) {
       // this.update(joined)
       // page = "minireport"
       page = "score"
       // page = "report"
       this.report(joined, page)
    }

    this.setState({
        selection: choice,
        activeWordIndex: this.state.activeWordIndex + 1,
        selections: joined,
        activePage: page
    })
   } 
  }

  selectExperiment(uid) {

  }

  renderLogin() {
        const { classes } = this.props;
    return ( 
			 <Paper className="login_card">
			   <div className="switch_container">
			     <div className="login_switch" style={{background: "#47d836"}} onClick={() => {this.setState({activePage: 'signup', message:""})}}>
			     Signup 
			     </div>
			   </div>

			   <h1>Login</h1>
			   <form  onSubmit={this.login} style={{marginTop:"30px"}}>
					  <div>
    					  <div className='authAlert' style={{color: 'blue'}}>{this.state.message}</div>
					  </div>
                <div>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="firstName" label="First Name" type="text" fullWidth autoFocus required  onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end" style={{display: "none"}}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="middleName" label="Middle Name" type="text" fullWidth onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="lastName" label="Last Name" type="text" fullWidth required  onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="password" label="Password" type="password" fullWidth required  onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '25px' }}>
                        <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Login</Button>
                    </Grid>
                </div>
			  </form>
            </Paper>
    );
  }

  renderSignup() {
	return (
			 <Paper className="login_card">
				<div className="switch_container">
					  <div className="login_switch" onClick={() => {this.setState({activePage: 'login', message: ""})}}>
					  Login
					  </div>
				</div>
			   <h1>Signup</h1>
			   <form  onSubmit={this.signup} style={{marginTop:"30px"}}>

					  <div>
    					  <div className='authAlert' style={{color: 'red'}} >{this.state.message}</div>
					  </div>
                <div>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="firstName" label="First Name" type="text" fullWidth autoFocus required onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end" style={{display: "none"}}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="middleName" label="Middle Name" type="text" fullWidth onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="lastName" label="Last Name" type="text" fullWidth required onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
					<Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
						<FormControl fullWidth required>	
							<InputLabel id="teachers">Teacher</InputLabel>
							<Select labelId="teachers" name="teacher" value={this.state.teacher} onChange={this.handleChange}>
							  <MenuItem value=""><em>None</em></MenuItem>
							  <MenuItem value="5e2ebbd9e414a94dc67fd995">Bleicher</MenuItem>
							  <MenuItem value="5e3454f8cc0b53337bc5fa13">Meurers</MenuItem>
							  <MenuItem value="5e34554acc0b53337bc5fa14">Deeg</MenuItem>
							  <MenuItem value="5e2ebbaae414a94dc67fd994">Goedicke</MenuItem>
							  {/* <MenuItem value="teacher3">Howind</MenuItem> */}
							  {/* <MenuItem value="teacher4">Lang</MenuItem> */}
							  {/* <MenuItem value="teacher5">Rehberger</MenuItem> */}
							  {/* <MenuItem value="teacher6">Spiegelhalter</MenuItem> */}
							</Select>
                        </FormControl>
						 </Grid>
			        </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="dob" label="Date of Birth" type="date" fullWidth required onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end" style={{display: "none"}}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="email" label="E-mail" type="email" fullWidth onChange={this.handleChange} />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '20px' }}>
                        <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Sign up</Button>
                    </Grid>
                    <div className="card">
                      Password: ddmmyyyyabc
                    <br />
                      (ddmmyyyy) Date of birth and (abc) first three letters of the name
                    <br />
                      for example: <br /> Walter White, 15/10/2004 <br /> <b>15102004wal</b>
                    </div>
                </div>
			  </form>
            </Paper>
	);
  }

  renderCheckoutbar() {
    return (
		<div className="checkout-wrap">
      <div className="checkout-bar-empty"></div>
		  <ul className="checkout-bar">
          	{this.state.tests.map((value, index) => {
            	return (
				  <li style={{width: (index !== this.state.activeTestIndex? 6 : 100 - (this.state.tests.length - 1) * 6).toString() + '%'}} className={index === this.state.activeTestIndex? 'active' : index < this.state.activeTestIndex? 'visited' : ''}> <div className="bar" style={{ width: (this.state.activeWordIndex / this.state.wordList.length) * 96+ "%" }}></div> {value['test_code'][5]}&#9734;</li>
            	)
          	})}
		  </ul>
		</div>

    );
  }

  renderHeader() {
  	return (
		<div>
			<div className='header'>
				<div>
					<div className='AppName'>DoYouKnowIt!</div>
					<div className='username'>{this.state.firstName}</div>
				</div>
			</div>
		</div>
	);
  }


 renderDashboard() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
			<div className="row">
			<button className="dashboardCard" onClick={this.getLevels}>English vocabulary test </button>
			<button className="dashboardCard" style={{background: "linear-gradient(45deg, rgb(98, 255, 0), rgba(0, 0, 0, 0.79))"}}>Science MCQs</button>
			<button className="dashboardCard" style={{background: "linear-gradient(45deg, rgba(224, 106, 23, 0.92), rgba(6, 3, 222, 0.79))"}}>Maths Assignment 01</button>
			</div>
			</div>
		</div>
	);
  }

 renderAdminDashboard() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div style={{padding: "2%"}}>
      <div className="tabs">
        <Tabs data={[
          ["Experiment", 
          <div>
            <div>
              {this.state.experiments.map((value, index) => {
                return (
                  // <div className="tooltip">
                  <button className="button" title={value[2]} onClick={this.selectExperiment(value[0])}> {value[1]} </button>
                  // <span className="tooltiptext"> {value[2]}</span>
                  // </div>
                )
                })}
              </div>
           <div className="card" style={{"color": "dimgrey"}}>
             Choose the testsets within the following range.
             101-120, 
             201-220, 
             301-320, 
             401-420, 
             501-520, 
             601-620 
             <br />
             <br />Example: <b>102;201;311;403;514</b>
           </div>
			     <form onSubmit={this.defineExperiment}>
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField name="expName" label="Exercise Name" type="text" fullWidth autoFocus required  onChange={this.handleChange}/>
                                <TextField name="experiment" label="Test Sequence" type="text" fullWidth required  onChange={this.handleChange}/>
                            </Grid>
                        </Grid>
                        <Grid container justify="center" style={{ marginTop: '20px' }}>
                            <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Save</Button>
                        </Grid>
			     </form>
           </div>]
          ,
          ["Export",
          <div>
      <div className='row'>
			  <form onSubmit={this.download}>
					<Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
						<FormControl fullWidth required>	
							<InputLabel id="teachers">Teacher</InputLabel>
							<Select labelId="teachers" name="teacher" value={this.state.teacher} onChange={this.handleChange}>
							  <MenuItem value=""><em>None</em></MenuItem>
							  <MenuItem value="5e2ebbd9e414a94dc67fd995">Bleicher</MenuItem>
							  <MenuItem value="5e3454f8cc0b53337bc5fa13">Meurers</MenuItem>
							  <MenuItem value="5e34554acc0b53337bc5fa14">Deeg</MenuItem>
							  <MenuItem value="5e2ebbaae414a94dc67fd994">Goedicke</MenuItem>
							</Select>
            </FormControl>
					</Grid>
			   </Grid>
					<Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
						<FormControl fullWidth required>	
							<InputLabel id="experiment">Experiment</InputLabel>
							<Select labelId="experiment" name="expId" value={this.state.expId} fullWidth onChange={this.handleChange}>
							  <MenuItem value=""><em>None</em></MenuItem>
          	    {this.state.experiments.map((value, index) => {
                  return (
							    <MenuItem value={value[0]}>{value[1]}</MenuItem>
               	)
          	    })}
							</Select>
            </FormControl>
					</Grid>
			   </Grid>
          <Grid container justify="center" style={{ marginTop: '20px' }}>
              <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Download</Button>
          </Grid>
			  </form>
      </div>
			</div>
    ],
          ["Users",
           <div> 
             {this.state.userList.map((value, index) => {
                return(
                  <div className={value["role"] + " userrow"}>
                    <div style={{"width": "98%", "display": "flex"}}>
                    <div className='usercard' style={{"width": "90%"}}>{value["name"]}</div>
                    <div className='usercard'>{value["role"]}</div>
                    </div>
                    <div className="removeuser" onClick={() => {this.removeuser(value["id"])}} style={{"width": "1%"}}> x </div>
                  </div>
                );
             })}
           </div>],
        ]}/>
        
        </div>
        </div>
        </div>
	);
  }

 renderTeacherDashboard() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
			<div className="row">
          {this.state.teacherReport.map((value, index) => {
            return (
              <div className="card level_card"  onClick={() => {this.setState({tests: value['tests'], studentResults:value['results'], expName:value["definition"], activePage: 'teacherlanding1'})}}>
                {value["definition"]}
              </div>
            )
          })}
			</div>
			</div>
		</div>
	);
  }

renderScoreCell(result) {
  function percentageToColor(percentage) {
  const colors = [
                   "#c50000a8",
                   "#c42a00a8",
                   "#c35400a8",
                   "#c27d00a8",
                   "#c1a600a8",
                   "#b2c000a8",
                   "#88bf00a8",
                   "#5fbe00a8",
                   "#36bd00a8",
                   "#0dbc00a8",
                   "#00bb1ba8",
                   "#00bb1ba8"]
    return colors[Math.floor(percentage/10)];
  }
  return (
    <div className="col-lg-9 row">
      {result.map((value, index) => {
        return(
          <div className="scoreCell card" style={{width: (100 / result.length).toString() + "%", background:percentageToColor(value["metrics"]["score"])}}  onClick={() => {this.setState({wordList: this.state.tests[index]['tokens'], metrics:value['metrics'], selections:value['evaluated_responses'], activePage: 'report'})}}>
            {value["metrics"]["score"]}
          </div>
        )
      })
      }
    </div>
  );
}

renderResultTableEntry() {
  return (
	  <div>
        {this.state.studentResults.map((value, index) => {
          return (
            <div className="row">
              <div className="scoreRow col-lg-3 card">
                 {value["name"]}
                 {/* <div style={{float: "right"}}> t </div> */}
              </div>
              {this.renderScoreCell(value["result"])}
            </div>
          )
        })}
	  </div>
  )
}

renderResultTableHeader() {
  return (
	  <div>
      <div className="row">
        <div className="scoreRow col-lg-3 card">
           Name
        </div>
        <div className="col-lg-9 row">
         {this.state.studentResults[0]["result"].map((value, index) => {
           return(
              <div className="scoreCell card" style={{width: (100 / this.state.studentResults[0]["result"].length).toString() + "%"}}>
               {value['test_code'][5]}&#9734;
             </div>
           )
         })
         }
        </div>
      </div>
	  </div>
  )

}

renderTeacherDashboard1() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
	      <div className='row'>
	        <button className='button back' onClick={() => {this.setState({activePage: 'teacherlanding'})}}> &#8617; </button>
	      </div>
        {this.renderResultTableHeader()}
        {this.renderResultTableEntry()}
			</div>
		</div>
	);
  }

  renderActivity() {
    return (
      <div className="canvas">
		{this.renderHeader()}
    {this.renderCheckoutbar()}
		<div className="content">
        <h1 className="word"> {this.state.wordList[this.state.activeWordIndex]} </h1>
        <div className="col-md-12">
          <div className="row card_ctr">
            <button className="button option green" onClick={() => {this.selection("yes")}}> known (y) </button>
            <button className="button option grey" onClick={() => {this.selection("no")}}> unknown (n) </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  renderIndex() {
    return(
      	<div className="canvas">
			{this.renderHeader()}
		<div className="content">
		<h1 style={{ marginBottom: 30 }}> Levels </h1>
        <div className="row">
          {this.state.levels.map((value, index) => {
            return (
              <div className="column" key={index}>
                <div className="card level_card" style={{borderRadius: 10}} onClick={() => {this.setState({testsets: value['testsets'], activePage: 'level'})}}>
                  {value['level']}
                </div>
              </div>
            )
          })}
        </div>
	  </div>
	 </div>
    );
  }

  renderLevel() {
    return(
      	<div className="canvas">
			{this.renderHeader()}
      <div className="content">
		<h1 style={{ marginBottom: 30 }}> Testsets </h1>
        <div className="row">
          {this.state.testsets.map((value, index) => {
            return (
              <div className="column" key={index}>
                <div className="card testset_card" style={{borderRadius: 10}} onClick={() => {this.setState({wordList: value['tokens'], activePage: 'activity'})}}> {value['test_code']}
                </div>
              </div>
            )
          })}
      </div>
	  <br />
	  <br />
	  <br />
	  <br />
	  <div className='row'>
	  <button className='button back' onClick={() => {this.setState({activePage: 'index'})}}> &#8617; </button>
	  </div>
	</div>
	</div>
    );
  }

  nextTest() {
    var testIndex = this.state.activeTestIndex + 1;
    if(testIndex < this.state.tests.length) {
      this.setState({
        activeTestIndex: testIndex,
        wordList: this.state.tests[testIndex]['tokens'],
        activeWordIndex: 0,
        selection: "",
        selections: [],
        levels: [],
        result: {},
        activePage: 'activity'})
    }
    else {
      this.setState({
        activeTestIndex: 0,
        activeWordIndex: 0,
        selection: "",
        selections: [],
        levels: [],
        result: {},
        activePage: 'thankyou'})
    }
  }

  renderInstructions() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
        <div className="instruct"> <b> Read through the list of words carefully. For each word: </b> <br /> <br />
                                   if you know what it means, click 'y' key or <button className="button option green"> known (y) </button> (for YES)  <br /> <br />
                                   if you don't know what it means, or if you aren't sure, click 'n' or click <button className="button option grey"> unknown (n) </button> key (for NO).</div>
	      <div>
           <br />
           <button style={{borderRadius: 10}} style={{borderRadius: 10, margin:"40px auto"}} onClick={() => {this.setState({activePage: 'activity'})}} > Continue </button>
        </div>
			</div>
      
		</div>
	);
  }

  renderThankyou() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
        <div className="thankyou">Thank You !!!</div>
			</div>
		</div>
	);
  }

  renderReport() {
    return (
      <div>
	  	<br />
	  	<br />
        <h1> Report </h1>
		<div className="row">
			<div className="column">
			  <div className="card" style={{borderRadius: 10 }}>
			    <h4>Hits</h4><br />
			    <h2>{this.state.metrics["hits"]}</h2>
			  </div>
			</div>
			<div className="column">
			  <div className="card" style={{borderRadius: 10 }}>
			    <h4>False Hits</h4><br />
			    <h2>{this.state.metrics["false_hits"]}</h2>
			  </div>
			</div>
			<div className="column">
			  <div className="card" style={{borderRadius: 10 }}>
			    <h4>Score</h4><br />
			    <h2>{this.state.metrics["score"]}</h2>
			  </div>
			</div>
		</div>
        <div className="row">
        {this.state.wordList.map((value, index) => {
          return (
            <div className="column col-md-3 col-sm-4" key={index}>
			  {this.renderReportCard(index, value)}
            </div>
          )
        })}
      </div>
	    <div className='row'>
	      <button className='button back' onClick={() => {this.setState({activePage: 'teacherlanding1'})}}> &#8617; </button>
	    </div>
	  <br />
	  <br />
      </div>
    );
  }

  renderMiniReport() {
    return ( 
      <div className="canvas">
		{this.renderHeader()}
    {this.renderCheckoutbar()}
	  	<br />
	  	<br />
		<div className="row">
			<div className="column">
			  <div className="card" style={{borderRadius: 10 }}>
			    <h4>Hits</h4><br />
			    <h2>{this.state.result["hits"]}</h2>
			  </div>
			</div>
			<div className="column">
			  <div className="card" style={{borderRadius: 10 }}>
			    <h4>False Hits</h4><br />
			    <h2>{this.state.result["false_hits"]}</h2>
			  </div>
			</div>
		</div>
        <div className="row">
           <button style={{borderRadius: 10}} onClick={() => {this.nextTest()}} > Next {this.state.activeTestIndex + 1} </button>
        </div>
      </div>
    );
  }

  renderScore() {
    return ( 
      <div className="canvas">
		{this.renderHeader()}
    {this.renderCheckoutbar()}
	  	<br />
	  	<br />
        <div className="scoreboard">
			<div className="row">	
				<div className="scorecard">{this.state.result["score"]}%</div>
      </div>
      <div>
				<div className="scoreFeedback">{this.state.result["message"]}</div>
			</div> 
            <div className="row">
               <button className="button" style={{borderRadius: 10, margin:"40px auto"}} onClick={() => {this.nextTest()}} > Next </button>
            </div>
        </div>
      </div>
    );
  }

  renderReportCard (index, value) {
    var selection = this.state.selections[index];
  var bgColor;
  var isFake;
	var textColor = "black";
	if (selection === "yes") {
		bgColor = "#01a22bcc";
	} else if (selection === "wrong") {
    // bgColor = "#c51a0988";
    bgColor = "repeating-linear-gradient(45deg, rgba(197, 26, 9, 0.6), rgba(197, 26, 9, 0.6) 10px, rgba(197, 26, 9, 0.8) 10px, rgba(197, 26, 9, 0.8) 20px)"
		textColor = "white";
  } else if(selection === "unknown")
   {
		// bgColor = "#004cc5bb";
		bgColor = "#c51a09cc";
		textColor = "white";
  } else {
    // bgColor = "grey";
    bgColor = "repeating-linear-gradient( 45deg, rgba(1, 162, 43, 0.6), rgba(1, 162, 43, 0.6) 10px, rgba(1, 162, 43, 0.8) 10px, rgba(1, 162, 43, 0.8) 20px )"
		// bgColor = "#01a22b88";
		// textColor = "white";
	}
	return (
    	<div className="card report_card" style={{color: textColor, background: bgColor}}>
    	  <h4 style={{textAlign: "center", display: "table-cell"}}> {value}</h4>
    	</div>
	 );
  }

  render() {
    return (
        <div className= "container">
        {this.pages[this.state.activePage]()}
        {this.state.isLoading ?
          <div className="overlay">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div> : null
        }
        </div>
    ); 
  }

}

export default App;

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0
    }
  }
  
  clickHandler = (e) => {
    this.setState({
      active: parseInt(e.currentTarget.attributes.num.value)
    })
  }
  
  render() {
    let content = "";
    const tabs = this.props.data.map(([label, text], i) => {
      content = this.state.active === i ? text : content;  
      return <li 
               className={this.state.active === i ? "tab active" : "tab" } 
               key={label} 
               num={i}
               onClick={this.clickHandler}>
        {label}
      </li>;
    });
    
    return ( 
      <section className="tabs">
        <menu>
          <ul>
            {tabs}
          </ul>
        </menu>
        <div>
          {content}
        </div>
      </section>);
  }
}