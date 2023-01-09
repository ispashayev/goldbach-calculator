# Goldbach Calculator

This project implements a simple web app for testing the Goldbach Conjecture.
The conjecture states that any even number can be expressed as the sum of two
prime numbers. The web app allows users to enter even numbers and then finds
two prime numbers that sum up to it.

This project is implemented using a React client and a Go server. To
determine the prime numbers, this project uses another repository of mine
(algorithms) as a submodule to generate a list of primes and then simply
brute-force searches through it.


## Setting up the Dev Environment

### Setting up the database

So far all development of this application has been done on Ubuntu.

1. Install Postgres
```
$ sudo apt install postgresql
```

2. Ensure that the Postgres service is running
```
$ service postgresql status
```

3. Connect to the Postgres service as the default `postgres` user.
```
$ sudo -u postgres psql
```

4. Create the dev database and user.
```
psql=# CREATE DATABASE gbcalc_dev;
psql=# CREATE USER gbcalc_dev WITH ENCRYPTED PASSWORD 'gbcalc_dev';
psql=# GRANT ALL PRIVILEGES ON DATABASE gbcalc_dev TO gbcalc_dev;
```

5. To connect to the application database from your shell as the dev user:
```
$ psql -h localhost -U gbcalc_dev -d gbcalc_dev
```
You will be prompted for the dev user password, to which you can enter `gbcalc_dev`.

### Updating the go version

Don't forget to update the heroku config
```
heroku config:set GOVERSION=<new_go_version>
```

### Running the app locally

1. Make sure to build the frontend. From the `client/` directory, run `yarn build`

2. To run the server, you can simply run `go run .` from the root of the repo. Note however, that in production the go app is automatically compiled by Heroku and then executed by the command specified in the Procfile. You can emulate this locally by running
```
$ go build -o bin/goldbach-calculator
$ ./bin/goldbach-calculator
```
