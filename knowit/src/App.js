import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
     constructor(props) {
        super(props);
        this.state = {
            user: "Me",
            wordList: [],
            activeWordIndex: 0,
            selection: "",
            selections: [],
        }
   }


  getWordList = (event) => {
    let stateData = this.state;
    this.setState({ isLoading: true })
    const user = {
      username: stateData.user,
    };
    let config = { "Content-Type": "application/json" };
    axios.post('http://localhost:8000/api/v1/getwordlist', user, config)
      .then(response => {this.setState({wordList: response.data.wordList})})
  }

  render() {
    return (
        <div className= "container">
        <button onClick={() => {this.getWordList()}} > load </button>
        <div id="progressbar" style={{marginTop: "50px"}}>
          <div style={{ width: (this.state.wordList.length - this.state.activeWordIndex) * 5 + "%" }}></div>
        </div>
        <h1 className="word"> {this.state.wordList[this.state.activeWordIndex]} </h1>
        <div className="col-md-12">
          <div className="row card_ctr">
            <button className="button green" onClick={() => {this.setState({selection: "yes"})}}> Yes </button>
            <button className="button red" onClick={() => {this.setState({selection: "no"})}}> No </button>
          </div>
        </div>
        </div>
    );
  }

}

export default App;
