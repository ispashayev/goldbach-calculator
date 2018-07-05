import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Navigation extends Component {
  render() {
    return(
      <div className="navigation">
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/goldbach-conjecture">Goldbach Conjecture</NavLink></li>
          <li><NavLink to="/graph-isomorphism">Graph Isomorphism</NavLink></li>
          <li><NavLink to="/riemann-hypothesis">Riemann Hypothesis</NavLink></li>
          <li><NavLink to="/contact">Contact Us</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default Navigation;