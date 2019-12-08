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

var HOST = '192.168.31.54'

class App extends Component {
     constructor(props) {
        super(props);
        this.state = {
            user: "Me",
            wordList: [],
            activeWordIndex: 0,
            selection: "",
            selections: [],
            levels: [],
			hits: 0,
			falseHits: 0,
			improperIds: [],

            // UI Handling
            // isLoading: true,
            activePage: "signup",

            // Login details

            firstName: "",
            lastName: "",
            middleName: "",
            role: "",
            email: "",
            password: "",
			message: "",
        };
       this.pages = {
         "login": this.renderLogin.bind(this),
         "signup": this.renderSignup.bind(this),
		 "landing": this.renderDashboard.bind(this),
         "activity": this.renderActivity.bind(this),
         "index": this.renderIndex.bind(this),
         "level": this.renderLevel.bind(this),
         "report": this.renderReport.bind(this)
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
      email: stateData.email,
      password: stateData.password
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
	//	if (response.data.isValid) {
	//		this.getLevels();
	//	}
	//	else {
        this.setState({
			activePage: response.data.isValid ? 'landing': 'login',
			message: response.data.message,
            isLoading: false});
//		}
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
          hits: 0,
          falseHits: 0
        })
      })
  }

  componentWillMount() {
    // this.getLevels();
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
	// Handle true and false hits	
	var hitBuffer = 0;
	var falseHitBuffer = 0;
	if (choice === 'yes') {
        debugger;
		if (this.state.improperIds.indexOf(this.state.activeWordIndex + 1) >= 0) {
			falseHitBuffer = 1;
			choice = 'wrong';
		}
		else {
			hitBuffer = 1
		}
	}

    var joined = this.state.selections.concat(choice);
    var page = this.state.activePage
    if(joined.length >= this.state.wordList.length && this.state.wordList.length > 0) {
       page = "report"
    }

    this.setState({
        selection: choice,
        activeWordIndex: this.state.activeWordIndex + 1,
		falseHits: this.state.falseHits + falseHitBuffer,
		hits: this.state.hits + hitBuffer,
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
                    <Grid container spacing={8} alignItems="flex-end">
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
                    <Grid container spacing={8} alignItems="flex-end">
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
							<InputLabel id="rolelist">Role</InputLabel>
							<Select labelId="rolelist" name="role" value={this.state.role} onChange={this.handleChange}>
							  <MenuItem value=""><em>None</em></MenuItem>
							  <MenuItem value="student">Student</MenuItem>
							  <MenuItem value="teacher">Teacher</MenuItem>
							</Select>
                        </FormControl>
						 </Grid>
			        </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="email" label="E-mail" type="email" fullWidth onChange={this.handleChange} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField name="password" label="Password" type="password" fullWidth required onChange={this.handleChange}/>
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
					<div className='AppName'>Name</div>
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
			<div className="dashboardCard" onClick={this.getLevels}>Vocabulary test </div>
			</div>
		</div>
	);
  }

  renderActivity() {
    return (
      <div>
        <div id="progressbar" style={{marginTop: "50px"}}>
          <div style={{ width: (this.state.activeWordIndex / this.state.wordList.length) * 100 + "%" }}></div>
        </div>
        <h1 className="word"> {this.state.wordList[this.state.activeWordIndex]} </h1>
        <div className="col-md-12">
          <div className="row card_ctr">
            <button className="button option green" onClick={() => {this.selection("yes")}}> Bekannt (Y) </button>
            <button className="button option red" onClick={() => {this.selection("no")}}> Unbakannt (N) </button>
          </div>
        </div>
      </div>
    );
  }

  renderIndex() {
    return(
        <div className="canvas">
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
    );
  }

  renderLevel() {
    return(
      <div>
	  	<br />
	  	<br />
		<h1 style={{ marginBottom: 30 }}> Testsets </h1>
	  	<br />
	  	<br />
        <div className="row">
          {this.state.testsets.map((value, index) => {
            return (
              <div className="column" key={index}>
                <div className="card testset_card" style={{borderRadius: 10}} onClick={() => {this.setState({wordList: value['tokens'], improperIds: value['improper_Ids'], activePage: 'activity'})}}> {value['test_code']}
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
			    <h2>{this.state.hits}</h2>
			  </div>
			</div>
			<div className="column">
			  <div className="card" style={{borderRadius: 10 }}>
			    <h4>False Hits</h4><br />
			    <h2>{this.state.falseHits}</h2>
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
	  <br />
	  <br />
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
