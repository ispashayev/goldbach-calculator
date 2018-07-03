import React, { Component } from "react";
import MathJax from "react-mathjax";

class RiemannHypothesis extends Component {
  render() {
    return(
      <div>
        <MathJax.Provider>
          <h1 class="curiosity-title">The Riemann Hypothesis</h1>
          <div>
            We will first define The Riemann zeta function and then dissect and
            interpret it.
          </div>
          <br />
          <div>
            The definition is as follows:
            <MathJax.Node formula={
            `
              \\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\frac{1}{1^s} + \\frac{1}{2^s} + \\frac{1}{3^s} + \\cdots
            `} />
          </div>
          <br />
          <div>
            The variable
            &nbsp;<MathJax.Node inline formula={"s"} />&nbsp;
            is over the domain of all Complex Numbers that have a real number
            component greater than 1. As a reminder to some readers, a complex
            number is a number that can be represented as
            &nbsp;<MathJax.Node inline formula={"a + b \\cdot i"} />,
            where
            &nbsp;<MathJax.Node inline formula={"i := \\sqrt{-1}"} />,
            and
            &nbsp;<MathJax.Node inline formula={"a"} />&nbsp;
            and
            &nbsp;<MathJax.Node inline formula={"b"} />&nbsp;
            are both real numbers.
            &nbsp;<MathJax.Node inline formula={"a"} />&nbsp;
            is called the real component and
            &nbsp;<MathJax.Node inline formula={"b"} />&nbsp;
            is called the imaginary component. Even though these kinds of
            numbers are also called imaginary numbers, they are incredibly
            useful in many engineering and scientific applications, such as
            signal processing, fluid dynamics, and quantum mechanics to name
            just a few.
          </div>
          <br />
          <div>
            Anyways, the Riemann Hypothesis states that the Riemann zeta
            function has its zeros only at the negative even integers and
            complex numbers with real part
            &nbsp;<MathJax.Node inline formula={"\\frac{1}{2}"} />.
          </div>
          <br />
          <div>
            This curiosity is still under development, with visualizations to
            come soon.
          </div>
        </MathJax.Provider>
      </div>
    );
  }
}

export default RiemannHypothesis;