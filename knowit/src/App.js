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

var HOST = '192.168.42.137' 

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
        };
       this.pages = {
          "login": this.renderLogin.bind(this),
          "signup": this.renderSignup.bind(this),
		      "landing": this.renderDashboard.bind(this),
		      "adminlanding": this.renderAdminDashboard.bind(this),
		      "teacherlanding": this.renderTeacherDashboard.bind(this),
		      "teacherlanding1": this.renderTeacherDashboard1.bind(this),
		      "teacherlanding2": this.renderTeacherDashboard2.bind(this),
          "activity": this.renderActivity.bind(this),
          "index": this.renderIndex.bind(this),
          "level": this.renderLevel.bind(this),
          "report": this.renderReport.bind(this),
          "minireport": this.renderMiniReport.bind(this),
          "score": this.renderScore.bind(this),
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
    axios.post('http://' + HOST + ':8000/api/v1/signup', user, config)
      .then(response => {
        this.setState({activePage: response.data.isValid ? "login" : 'signup',
					   message: response.data.message,
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
	    experiment: stateData.experiment
    };
    this.setState({ isLoading: true })
    let config = { "Content-Type": "application/json" };
    axios.post('http://' + HOST + ':8000/api/v1/defineexp', user, config)
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
    axios.post('http://' + HOST + ':8000/api/v1/login', user, config)
      .then(response => {
	  if (response.data.isValid) {
		  if (response.data.role === 'Admin') {
		  	this.setState({role: 'Admin',
						   activePage: 'adminlanding',
                           password: response.data.password,
						   isLoading: false});
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
    axios.post('http://' + HOST + ':8000/api/v1/getteacherreport', user, config)
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
    axios.post('http://' + HOST + ':8000/api/v1/updateresponse', user, config)
      .then(response => {
        this.setState({message: response.data.message
                       })
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
    axios.post('http://' + HOST + ':8000/api/v1/getresult', user, config)
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
    axios.post('http://' + HOST + ':8000/api/v1/getlevels', user, config)
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
    axios.post('http://' + HOST + ':8000/api/v1/gettests', user, config)
      .then(response => {
        this.setState({
          tests: response.data.tests,
          isLoading: false,
          activeTestIndex: response.data.index,
          wordList: response.data.tests[response.data.index]['tokens'],
          activePage: "activity"
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
    axios.post('http://' + HOST + ':8000/api/v1/getwordlist', user, config)
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
    					  <div className='authAlert' style={{color: 'red'}}>{this.state.message}</div>
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
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                        <Grid item>
                            <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
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
							  <MenuItem value="5e2ebbaae414a94dc67fd994">Goedicke</MenuItem>
							  <MenuItem value="teacher3">Howind</MenuItem>
							  <MenuItem value="teacher4">Lang</MenuItem>
							  <MenuItem value="teacher5">Rehberger</MenuItem>
							  <MenuItem value="teacher6">Spiegelhalter</MenuItem>
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
                </div>
			  </form>
            </Paper>
	);
  }

  renderHeader() {
  	return (
		<div>
			<div className='header'>
				<div>
					<div className='AppName' onClick={()=>{this.setState({activePage: "landing"})}}>HomeWork</div>
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
			<div className="content">
			<div className="row">
			<form onSubmit={this.defineExperiment}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="experiment" label="Test Sequence" type="text" fullWidth autoFocus required  onChange={this.handleChange}/>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '20px' }}>
                        <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Save</Button>
                    </Grid>
			</form>
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


 renderTeacherDashboard1() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
			  <div className="row">
          {this.state.studentResults.map((value, index) => {
            return (
              <div className="card testset_card"  onClick={() => {this.setState({aStudentResult: value["result"], activePage: 'teacherlanding2'})}}>
                {value["name"]}
              </div>
            )
          })}
			  </div>
	    <div className='row'>
	      <button className='button' onClick={() => {this.setState({activePage: 'teacherlanding'})}}> Back </button>
	    </div>
			</div>
		</div>
	);
  }

 renderTeacherDashboard2() {
  	return (
		<div className="canvas">
			{this.renderHeader()}
			<div className="content">
			  <div className="row">
          {this.state.aStudentResult.map((value, index) => {
            return (
              <div className="card testset_card"  onClick={() => {this.setState({wordList: this.state.tests[index]['tokens'], metrics:value['metrics'], selections:value['evaluated_responses'], activePage: 'report'})}}>
                {value["test_code"]}
              </div>
            )
          })}
			  </div>
	    <div className='row'>
	      <button className='button' onClick={() => {this.setState({activePage: 'teacherlanding1'})}}> Back </button>
	    </div>
			</div>
		</div>
	);
  }

  renderActivity() {
    return (
      <div className="canvas">
		{this.renderHeader()}
		<div className="checkout-wrap">
		  <ul className="checkout-bar">
          	{this.state.tests.map((value, index) => {
            	return (
				  <li style={{width: (index !== this.state.activeTestIndex? 6 : 100 - (this.state.tests.length - 1) * 6).toString() + '%'}} className={index === this.state.activeTestIndex? 'active' : index < this.state.activeTestIndex? 'visited' : ''}> {value['test_code'][5]}&#9734;</li>
            	)
          	})}
		  </ul>
		</div>
		<div className="content">
        <div id="progressbar">
          <div style={{ width: (this.state.activeWordIndex / this.state.wordList.length) * 100 + "%" }}></div>
        </div>
        <h1 className="word"> {this.state.wordList[this.state.activeWordIndex]} </h1>
        <div className="col-md-12">
          <div className="row card_ctr">
            <button className="button option green" onClick={() => {this.selection("yes")}}> known (Y) </button>
            <button className="button option red" onClick={() => {this.selection("no")}}> unknown (N) </button>
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
	  <button className='button' onClick={() => {this.setState({activePage: 'index'})}}> Back </button>
	  </div>
	</div>
	</div>
    );
  }

  nextTest() {
    var testIndex = this.state.activeTestIndex + 1;
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
	      <button className='button' onClick={() => {this.setState({activePage: 'teacherlanding2'})}}> Back </button>
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
		<div className="checkout-wrap">
		  <ul className="checkout-bar">
          	{this.state.tests.map((value, index) => {
            	return (
				  <li style={{width: (index !== this.state.activeTestIndex? 6 : 100 - (this.state.tests.length - 1) * 6).toString() + '%'}} className={index === this.state.activeTestIndex? 'active' : index < this.state.activeTestIndex? 'visited' : ''}> {value['test_code'][5]}&#9734;</li>
            	)
          	})}
		 </ul>
	    </div>
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
		<div className="checkout-wrap">
		  <ul className="checkout-bar">
          	{this.state.tests.map((value, index) => {
            	return (
				  <li style={{width: (index !== this.state.activeTestIndex? 6 : 100 - (this.state.tests.length - 1) * 6).toString() + '%'}} className={index === this.state.activeTestIndex? 'active' : index < this.state.activeTestIndex? 'visited' : ''}> {value['test_code'][5]}&#9734;</li>
            	)
          	})}
		 </ul>
	    </div>
	  	<br />
	  	<br />
        <div className="scoreboard">
			<div className="row">	
				<div className="scorecard">{this.state.result["score"]}%</div>
				<div >{this.state.result["message"]}</div>
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
	var textColor = "black";
	if (selection === "yes") {
		bgColor = "#01a22b88";
	} else if (selection === "wrong") {
		bgColor = "#c51a0988";
  } else if(selection === "unknown")
   {
		bgColor = "#004cc5bb";
		textColor = "white";
  } else {
		bgColor = "grey";
		textColor = "white";
	}
	return (
    	<div className="card report_card" style={{color: textColor, background: bgColor}}>
    	  <h4 style={{textAlign: "center", display: "table-cell"}}>{value}</h4>
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
