import React from 'react';

import MathJax from 'react-mathjax';

const Discussion = () => 
  <MathJax.Provider>
    <div className="section-header">Discussion</div>
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
      Details about the Goldbach Factorizer implementation:
      <br /><br />
      The way it works is by scanning through a large primes file (10,000,000 primes)
      for the first prime number. It then checks if the difference between that prime
      and the queried even number is prime. Many even numbers have a very small prime
      number as one of their prime factors, which is why in the common case the server
      performs the factorization quickly. Where this method would fail is a large even
      number where the Goldbach Factors are close to each other. Determining what even
      numbers fit this criteria could be an interesting question.
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
    </div>
  </MathJax.Provider>

export default Discussion;
