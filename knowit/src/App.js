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
    var joined = this.state.selections.concat(choice);
    var page = "activity"
    if(joined.length >= this.state.wordList.length) {
       page = "report"
    }
    this.setState({
        selection: choice,
        activeWordIndex: this.state.activeWordIndex + 1,
        selections: joined,
        activePage: page
    })
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
            <button className="button green" onClick={() => {this.selection("yes")}}> Bekannt (Y) </button>
            <button className="button red" onClick={() => {this.selection("no")}}> Unbakannt (N) </button>
          </div>
        </div>
      </div>
    );
  }

  renderIndex() {
    return(
        <div>
		<h1 style={{ marginBottom: 30 }}> Levels </h1>
	  	<br />
	  	<br />
        <div className="row">
          {this.state.levels.map((value, index) => {
            return (
              <div className="column" key={index}>
                <div className="card" style={{borderRadius: 10}}>
                  <button onClick={() => {this.setState({testsets: value['testsets'], activePage: 'level'})}}>{value['level']}</button>
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
		<h1 style={{ marginBottom: 30 }}> Testsets </h1>
	  	<br />
	  	<br />
        <div className="row">
          {this.state.testsets.map((value, index) => {
            return (
              <div className="column" key={index}>
                <div className="card" style={{borderRadius: 10}}>
                  <button onClick={() => {this.setState({wordList: value['tokens'], activePage: 'activity'})}}>{value['test_code']}</button>
                </div>
              </div>
            )
          })}
      </div>
	</div>
    );
  }

  renderReport() {
    return (
      <div>
        <h1> Report </h1>
        <div className="row">
        {this.state.wordList.map((value, index) => {
          return (
            <div className="column col-md-2" key={index}>
              <div className="card" style={this.state.selections[index] === "yes" ? {background: "#01a22b88"} : {background: "#c51a0988"}}>
                <h4 style={{textAlign: "center"}}>{value}</h4>
              </div>
            </div>
          )
        })}
      </div>
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
