import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './home';
import Contact from './contact';

import GoldbachConjecture from './goldbach-conjecture';

class Content extends Component {
  render() {
    return(
      <div className="content">
        <Route path="/" exact component={Home} />
        <Route path="/goldbach-conjecture" component={GoldbachConjecture}/>
        <Route path="/contact" component={Contact} />
      </div>
    );
  }
}

export default Content;