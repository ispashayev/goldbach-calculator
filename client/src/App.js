import React, { Component } from 'react';

import GoldbachConjecture from './components/goldbach-conjecture';
import Contact from './components/contact';

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
        <div className="content-pane"><Contact /></div>
      </div>
    );
  }
}

export default App;
