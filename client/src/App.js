import React, { Component } from 'react';

import Contact from './components/contact';
import Discussion from './components/discussion';
import GoldbachConjecture from './components/goldbach-conjecture';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">GOLDBACH CALCULATOR</div>
        </header>
        <div className="content-pane"><GoldbachConjecture /></div>
        <div className="content-pane"><Discussion /></div>
        <div className="content-pane"><Contact /></div>
      </div>
    );
  }
}

export default App;
