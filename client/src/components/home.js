import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <div className="curiosity-home-component">
        <h1 className="curiosity-home-title">Welcome!</h1>
        <div>
          So far we only have a series for math, as that is my background. My
          hope is to eventually develop this into a platform where anyone
          with knowledge of a particular topic can share it with others in an
          interesting and instructive manner.
        </div>
        <br />
        <div>
          If you're feeling curious, please take a look around and see if
          anything arouses your interest!
        </div>
        <br />
        <div>
          Last but not least, any feedback is always appreciated.
        </div>
      </div>
    );
  }
}

export default Home;