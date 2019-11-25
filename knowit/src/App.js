import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var HOST = '192.168.23.222'

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
            isLoading: true,
            activePage: "index",
        };
       this.pages = {
         "activity": this.renderActivity.bind(this),
         "index": this.renderIndex.bind(this),
         "level": this.renderLevel.bind(this),
         "report": this.renderReport.bind(this)
       };

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
    this.getLevels();
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
        <div>
	  	<br />
	  	<br />
		<h1 style={{ marginBottom: 30 }}> Levels </h1>
	  	<br />
	  	<br />
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
