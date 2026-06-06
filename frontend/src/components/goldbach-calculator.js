import React, { Component } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';


class GoldbachCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: undefined,
      primeOne: '',
      primeTwo: '',
      queries: [],
      isLoading: false,
      error: null,
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
        error: null,
      })
    }

    fetch(`${process.env.REACT_APP_GOLDBACH_CALCULATOR_LAMBDA_URL}/factor/${this.state.n}`)
      .then(async res => {
        if (!res.ok) {
          let errData;
          try {
            errData = await res.json();
          } catch (e) {
            throw new Error(`Request failed with status ${res.status}`);
          }
          throw new Error(errData.error || 'An error occurred while computing the primes.');
        }
        return res.json();
      })
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
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          error: err.message,
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
                {this.state.isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Computing...
                  </>
                ) : (
                  'Compute prime pair!'
                )}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        {this.state.error && (
          <Alert variant="danger" className="mb-3">
            {this.state.error}
          </Alert>
        )}
        {this.state.queries.length > 0 && (
          <Card className="query-results">
            <Card.Header className="query-results-header">
              Query Results
            </Card.Header>
            <ListGroup variant="flush">
              {
                this.state.queries.map((query, index) =>
                  <ListGroup.Item key={index}>
                    {Number(query.n).toLocaleString()} = {Number(query.p).toLocaleString()} + {Number(query.q).toLocaleString()}
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
