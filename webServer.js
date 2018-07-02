'use strict';

const express = require('express');
const path = require('path');

const app = express();

var primes;

var fs = require('fs');
fs.readFile('data/primes.dat', function (error, dataBuffer) {
  console.log('Parsing primes file...');
  if (error) {
    console.log('Error opening primes file.');
  } else {
    primes = dataBuffer.toString().split("\n").map(function (p) {
      return parseInt(p);
    });
    console.log('Done.');
  }
});

/* We have the express static module do all the work for us. */
app.use(express.static(path.join(__dirname, '/client/build')));

/* TODO: Refactor for React App */
// app.get('/curiosities', function (request, response) {
//   var curiosities = [];
//   var goldbachConjecture = {
//     link: "goldbach-conjecture",
//     name: "Goldbach Conjecture"
//   };
//   var riemannHypothesis = {
//     link: "riemann-hypothesis",
//     name: "Riemann Hypothesis"
//   };
//   var graphIsomorphism = {
//     link: "graph-isomorphism",
//     name: "Graph Isomorphism"
//   };
//   curiosities.push(goldbachConjecture);
//   curiosities.push(riemannHypothesis);
//   curiosities.push(graphIsomorphism);

//   response.status(200).send(curiosities);
// });

function getPrimeStructure(n) {
  var result = {
    n: n,
    success: false,
    message: 'Unable to find prime structure'
  };

  /* Simple brute force search. */
  /* TODO: Maybe can optimize this by starting at (n/2, n/2), or around it? */
  for (var i = 0; i < primes.length; i++) {
    for (var j = i; j < primes.length; j++) {
      if (primes[i] + primes[j] === n) {
        result.primeOne = primes[i];
        result.primeTwo = primes[j];
        result.message = 'Successfully found the Goldbach Factors';
        result.success = true;
        return result;
      }
    }
  }

  return result;

}

app.get('/curiosities/goldbach/:n', function(request, response) {
  var n = request.params.n ? parseInt(request.params.n) : undefined;
  if (n === undefined || n < 4 || n % 2 !== 0) {
    response.status(400).send();
    return;
  }
  /* Compute primes. */
  var result = getPrimeStructure(n);
  response.status(200).send(result);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
