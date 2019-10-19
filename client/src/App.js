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
          <div className="sidebar-and-content">
            <div className="sidebar">
              <NavLink exact to="/" className="side-item-container" activeClassName="side-item-selected">
                <div className="side-item">Calculator</div>
              </NavLink>
              <NavLink to="/discussion" className="side-item-container" activeClassName="side-item-selected">
                <div className="side-item">Discussion</div>
              </NavLink>
              <NavLink to="/contact" className="side-item-container" activeClassName="side-item-selected">
                <div className="side-item">Contact</div>
              </NavLink>
            </div>
            <div className="content-pane">
              <Route exact path="/" component={GoldbachCalculator} />
              <Route path="/discussion" component={Discussion} />
              <Route path="/contact" component={Contact} />
            </div>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
