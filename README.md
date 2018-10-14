# Goldbach Calculator

This project implements a simple web app for testing the Goldbach Conjecture.
The conjecture states that any even number can be expressed as the sum of two
prime numbers. The web app allows users to enter even numbers and then finds
two prime numbers that sum up to it.

This project is implemented using a React front-end and Node back-end. To
determine the prime numbers, this project uses another repository of mine
(algorithms) as a submodule to generate a list of primes and then simply
brute-force searches through it.
