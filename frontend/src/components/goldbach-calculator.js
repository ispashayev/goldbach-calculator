import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';


class GoldbachCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: undefined,
      primeOne: '',
      primeTwo: '',
      queries: [],
      isLoading: false,
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
        isLoading: false,
      });
      return;
    } else {
      this.setState({
        isLoading: true,
      })
    }

    fetch(`${process.env.REACT_APP_GOLDBACH_CALCULATOR_LAMBDA_URL}/factor/${this.state.n}`)
      .then(res => res.json())
      .then(res => {
        const queryResult = {
          n: this.state.n,
          p: res.P,
          q: res.Q,
        };
        let updatedQueries = this.state.queries.slice();
        updatedQueries.push(queryResult);

        this.setState({
          queries: updatedQueries,
          isLoading: false,
        });
      });
  }

  render() {
    return (
      <div>
        <div className="section-header">The Goldbach Conjecture</div>
        <div>
          Any even number can be expressed as the sum of two primes. Test it out yourself!
        </div>
        <br />
        <div>
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
              <Button
                variant="outline-secondary"
                onClick={() => this.submitGoldbachQuery()}
                disabled={this.state.isLoading}
              >
                Compute prime pair!
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        {this.state.queries.length > 0 && (
          <Card className="query-results">
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
      </div>
    );
  }
}

export default GoldbachCalculator;
