'use strict';

const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

var PythonShell = require('python-shell');

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
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());

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

app.post('/curiosities/graph-isomorphism/compute', function (request, response) {
  
  /*
  Parse graphs from request body and dump them as dat files in the
  `data/graph-isomorphism` directory.
  */
  var graph_A = request.body.A.join(',');
  var graph_B = request.body.B.join(',');

  var options = {
  mode: 'text',
  args: [graph_A, graph_B]
};

  /* Execute Python script that reads the graphs and calls the algorithms
     for computing an isomorphism on them. */
  PythonShell.run('compute-graph-isomorphism.py', options, function (err, result) {
    if (err) {
      response.status(400).end();
      throw err;
    }
    console.log(result);
    response.status(200).send('kek');
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
