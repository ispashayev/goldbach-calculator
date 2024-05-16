import React from 'react';

import MathJax from 'react-mathjax';

const Discussion = () =>
  <MathJax.Provider>
    <div className="section-header">Discussion</div>
    <div>
      The Goldbach conjecture indicates a relationship between a pair of primes
      &nbsp;<MathJax.Node inline formula={"(p,q)"} />&nbsp;
      and an even number
      &nbsp;<MathJax.Node inline formula={"n"} />.
      However, it's interesting that this relationship is not a one-to-one mapping.
      Take for example the number 14. There are two pairs of primes such that
      their sum is equal to 14:
      <MathJax.Node formula={`
        (3,11): 3 + 11 = 14 \\\\
        (7,7): 7 + 7 = 14
      `} />
    </div>
    <br />
    <div>
      The calculator implemented in this web app however will always return the pair
      with the lowest prime number (e.g. the first pair in the above example). This is
      because its implementation is rather naive in that it performs a search over a
      pre-computed list of primes.
      <br /><br />
      For each prime in the list of primes, we check if the difference between the target
      even number and that prime is itself prime. If so, then we have found our prime pair.
      Otherwise, we iterate to the next prime. Many even numbers have a very small prime
      number as one of their prime factors, which is why in the common case the server
      computes the pair quickly.
      <br /><br />
      The implementation does have its limitations however. The even number could be so large
      that the span of prime pairs does not include the queried even number, in which case the
      server would take a long time before sending back an empty response. Even if the even
      number is covered by the possible prime pairs, it could be so large that the server
      takes a while to respond with the correct answer.
      <br /><br />
      The prime number file was generated using a Fortran program that implements
      the sieve of Eratosthenes. The upper bound for generating 10,000,000 primes
      in the sieve was approximated using the Prime Number Theorem, which was then
      solved for using Newton's Method. The code can be seen&nbsp;
      <a
        href="https://github.com/ispashayev/algorithms/blob/master/lib/sieve-of-eratosthones.f03"
        target="_blank"
        rel="noopener noreferrer">
        here
      </a>.
      <br /><br />
      This app itself is implemented using React for the front-end, and Go for the back-end.
      A prior implementation had a Go server that would both serve the front-end static files,
      and provide an endpoint to query the prime pair for a given even number. The current
      implementation however has no explicit server configured. The front-end is now being served
      by AWS CloudFront, whereas the prime pairs are now being computed by an AWS Lambda
      function, which is still implemented in Go. All of the infrastructure for this app
      is provisioned in AWS and is managed with Terraform. The application code itself is defined
      separately from the Terraform code and can be viewed&nbsp;
      <a
        href="https://github.com/ispashayev/goldbach-calculator"
        target="_blank"
        rel="noopener noreferrer">
        here
      </a>.
    </div>
  </MathJax.Provider>

export default Discussion;
