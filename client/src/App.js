import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Navigation from './components/navigation';
import Content from './components/content';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">THE GOLDBACH CONJECTURE</h1>
        </header>
        <HashRouter>
          <div className="routerFlexBox">
            <Navigation />
            <Content />
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
