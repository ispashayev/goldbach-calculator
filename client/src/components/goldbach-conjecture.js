import React, { Component } from 'react';
import axios from 'axios';

import MathJax from 'react-mathjax';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';


class GoldbachConjecture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: undefined,
      primeOne: '',
      primeTwo: '',
      queries: [],
    };
  }

  submitGoldbachQuery() {
    if (this.state.n === undefined) {
      alert('Please enter a number to query!');
      return;
    }

    if (this.state.n <= 2 || this.state.n % 2 !== 0) {
      alert('Number must be an even number greater than 2!');
      this.setState({
        n: undefined,
      });
      return;
    }

    axios
    .get(`/factor/${this.state.n}`)
    .then(res => {
      if (res.data.success === true) {
        const queryResult = {
          n: this.state.n,
          p: res.data.primeOne,
          q: res.data.primeTwo,
        };
        let updatedQueries = this.state.queries.slice();
        updatedQueries.push(queryResult);

        this.setState({
          queries: updatedQueries,
        });
      }

      this.setState({
        n: undefined,
      });
    });
  }

  render() {
    return (
      <MathJax.Provider>
        <div className="section-header">The Goldbach Conjecture</div>
        <div>
          Any even number can be expressed as the sum of two primes. We define this
          pair of primes as the <b>Goldbach Factors</b>. Test it out yourself!
        </div>
        <br />
        <div className="goldbach-conjecture-factorizer">
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              placeholder="Enter an even number..."
              aria-label="Enter an even number..."
              aria-describedby="goldbach-query-input"
              value={this.state.n}
              onChange={(event) => this.setState({ n: event.target.value })}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={() => this.submitGoldbachQuery()}>
                Compute prime pair!
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        {this.state.queries.length > 0 && (<Card className="query-results">
          <Card.Header className="query-results-header">
              Query Results
          </Card.Header>
          <ListGroup variant="flush">
            {
              this.state.queries.map((query) =>
                <ListGroup.Item>
                  {query.n} = {query.p} + {query.q}
                </ListGroup.Item>
              )
            }
          </ListGroup>
        </Card>)}
        <br />
        <div>
          It's interesting to note that the Goldbach conjecture implies a
          relationship between a pair of primes
          &nbsp;<MathJax.Node inline formula={"(p,q)"} />&nbsp;
          and an even number
          &nbsp;<MathJax.Node inline formula={"n"} />.
          However, what's also interesting is that this relationship is not a
          one-to-one mapping.
        </div>
        <br />
        <div>
          Take for example the number 14. There are two pairs of primes such that
          their sum is equal to 14:
          <MathJax.Node formula={`
            (3,11): 3 + 11 = 14 \\\\
            (7,7): 7 + 7 = 14
          `} />
        </div>
        <br />
        <div>
          In math, we call a one-to-one mapping a bijective function, or just a
          bijection. We care about bijections because they pair each element
          from either set with an element from the other set, and each element
          gives a single inverse. In this case however, each even number can
          have multiple and variable numbers of prime-pairs that add up to it.
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

      </MathJax.Provider>
    );
  }
}

export default GoldbachConjecture;
