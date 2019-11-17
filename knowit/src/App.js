import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
     constructor(props) {
        super(props);
        this.state = {
            wordlist: [],
            word: "Word",
        }
   }

  render() {
    return (
        <div className= "container">
        <div id="progressbar" style={{marginTop: "50px"}}>
          <div style={{ width: "100%" }}></div>
        </div>
        <h1 className="word"> Word </h1>
        <div className="col-md-12">
          <div className="row card_ctr">
            <button className="button green" onClick={() => {this.setState({activePage: "words"})}}> Yes </button>
            <button className="button red" onClick={() => {this.setState({activePage: "words"})}}> No </button>
          </div>
        </div>
        </div>
    );
  }

}

export default App;
