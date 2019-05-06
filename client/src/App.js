import React, { Component } from 'react';

import Contact from './components/contact';
import Discussion from './components/discussion';
import GoldbachConjecture from './components/goldbach-conjecture';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">GOLDBACH CALCULATOR</h1>
        </header>
        <div className="content-pane"><GoldbachConjecture /></div>
        <div className="content-pane"><Discussion /></div>
        <div className="content-pane"><Contact /></div>
      </div>
    );
  }
}

export default App;
