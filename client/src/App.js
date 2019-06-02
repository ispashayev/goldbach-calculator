import React, { Component } from 'react';

import './App.css';

import Contact from './components/contact';
import Discussion from './components/discussion';
import GoldbachCalculator from './components/goldbach-calculator';
import { HashRouter, NavLink, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">GOLDBACH CALCULATOR</div>
        </header>
        <HashRouter>
          <div className="side-bar">
            <div><NavLink to="/">Calculator</NavLink></div>
            <div><NavLink to="/discussion">Discussion</NavLink></div>
            <div><NavLink to="/contact">Contact</NavLink></div>
          </div>
          <div className="content-pane">
            <Route exact path="/" component={GoldbachCalculator} />
            <Route path="/discussion" component={Discussion} />
            <Route path="/contact" component={Contact} />
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
