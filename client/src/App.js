import React, { Component } from 'react';

import './App.css';

import Contact from './components/contact';
import Discussion from './components/discussion';
import GoldbachConjecture from './components/goldbach-conjecture';
import SideNav from './components/sidenav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">GOLDBACH CALCULATOR</div>
        </header>
        <SideNav />
        <div className="content-pane"><GoldbachConjecture /></div>
        <div className="content-pane"><Discussion /></div>
        <div className="content-pane"><Contact /></div>
      </div>
    );
  }
}

export default App;
