import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navigation extends Component {
  render() {
    return(
      <div className="navigation">
        <div className="curiosity-link"><NavLink to="/">Home</NavLink></div>
        <div className="curiosity-link"><NavLink to="/goldbach-conjecture">Goldbach Conjecture</NavLink></div>
        <div className="curiosity-link"><NavLink to="/contact">Contact Us</NavLink></div>
      </div>
    );
  }
}

export default Navigation;