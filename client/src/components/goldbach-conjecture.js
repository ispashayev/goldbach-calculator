import React, { Component } from "react";
import axios from "axios";

class GoldbachConjecture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: "",
      primeOne: "",
      primeTwo: "",
    };
  }

  submitGoldbachQuery() {
    axios.get(`/curiosities/goldbach/${this.state.n}`)
    .then(res => {
      if (res.data.success === true) {
        this.setState({
          primeOne: res.data.primeOne,
          primeTwo: res.data.primeTwo,
        });
      } else {
        this.setState({
          primeOne: "",
          primeTwo: "",
        });
      }
    });
  }

  render() {
    return(
      <div>
        
        <h1 className="curiosity-title">The Goldbach Conjecture</h1>
        <div>
          Any even number can be expressed as the sum of two primes. We define this
          pair of primes as the <b>Goldbach Factors</b>. Test it out yourself!
        </div>
        <br />
        <div className="goldbach-conjecture-factorization-history">
          Previous queries: (TODO)
          <br />
        </div>
        <div className="goldbach-conjecture-factorizer">
          <div>
            <label>
              Enter an even number:&nbsp;
              <input type="text" onChange={(event) => this.setState({ n: event.target.value })} />
            </label>
          </div>
          <button onClick={() => this.submitGoldbachQuery()}>
            Compute prime pair!
          </button>
          <div>Factor one: {this.state.primeOne}</div>
          <div>Factor two: {this.state.primeTwo}</div>
        </div>
        <br />
        <div>
          It's interesting to note that the Goldbach conjecture implies the
          existence of a function (or an algorithm) $f$ that maps a pair of
          primes $(p,q)$ to an even number $n$. However, such a function cannot
          be a one-to-one mapping.
        </div>
        <br />
        <div>
          Take for example the number 14. There are two pairs of primes such that
          their sum is equal to 14:
          $$
          (3,11): 3 + 11 = 14 \\
          (7,7): 7 + 7 = 14
          $$
          This implies that $f(3,11) = f(7,7) = 14$.
        </div>
        <br />
        <div>
          In math, we call a one-to-one mapping a bijective function, or just a
          bijection. We care about bijections because their inverses map to
          exactly one element. However, in our case there is no straightforward
          way of inverting $f$. Instead, every even number has at least one
          solution pair. Such a function is said to be surjective.
        </div>
        <br />
        <div>
          Note about the Goldbach Factorizer above:
          <br /><br />
          The way it works is by searching through a large primes file (10,000,000 primes).
          Many even numbers have a very small prime number as one of their prime factors,
          which is why in the common case the server performs the factorization
          quickly. However, at some point the search takes a few minutes to compute since
          the largest prime in the file is under 16,000,000. For example, factoring
          30,000,000 will still work, but take 5-10 minutes.
          <br /><br />
          The prime number file was generated using a Fortran program that implements
          the sieve of Eratosthenes. The upper bound for generating 10,000,000 primes
          in the sieve was approximated using the Prime Number Theorem, which was then
          solved for using Newton's Method. The code can be seen&nbsp;
          <a href="https://github.com/ispashayev/algorithms/blob/master/lib/sieve-of-eratosthones.f03" target="_blank" rel="noopener noreferrer">here</a>.
        </div>

      </div>
    );
  }
}

export default GoldbachConjecture;