import React, { Component } from "react";
import { Route } from "react-router-dom";

import Home from "./home";
import Contact from "./contact";

import GoldbachConjecture from "./goldbach-conjecture";
import GraphIsomorphism from "./graph-isomorphism/graph-isomorphism";
import RiemannHypothesis from "./riemann-hypothesis";

class Content extends Component {
  render() {
    return(
      <div className="content">
        <Route path="/" exact component={Home} />
        <Route path="/goldbach-conjecture" component={GoldbachConjecture}/>
        <Route path="/graph-isomorphism" component={GraphIsomorphism}/>
        <Route path="/riemann-hypothesis" component={RiemannHypothesis}/>
        <Route path="/contact" component={Contact} />
      </div>
    );
  }
}

export default Content;