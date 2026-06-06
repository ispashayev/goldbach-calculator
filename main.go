package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type GoldbachQuery struct {
	E int `json:"E"`
	P int `json:"P"`
	Q int `json:"Q"`
}

func loadPrimes() ([]int, error) {
	fd, err := os.Open("data/primes.dat")
	if err != nil {
		return nil, err
	}

	var primes []int

	primesReader := io.Reader(fd)
	scanner := bufio.NewScanner(primesReader)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		prime, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
		if err != nil {
			return nil, err
		}

		primes = append(primes, prime)
	}

	err = scanner.Err()
	if err != nil {
		return nil, err
	}
	log.Printf("Loaded %d primes", len(primes))

	return primes, nil
}

func findGoldbachFactors(evenNumber int) (*GoldbachQuery, error) {
	primes, err := loadPrimes()
	if err != nil {
		return nil, err
	}

	if len(primes) == 0 {
		log.Printf("No primes loaded.")
		return nil, nil
	}

	maxPrime := primes[len(primes)-1]
	if evenNumber > 2*maxPrime {
		log.Printf("Even number %d is too large (max queryable: %d)", evenNumber, 2*maxPrime)
		return nil, nil
	}

	// Step 1. Find the largest prime that is less than or equal to the even number
	lPrime, rPrime := 0, len(primes)-1
	for lPrime < rPrime {
		mid := (lPrime + rPrime + 1) / 2
		prime := primes[mid]
		if prime > evenNumber {
			rPrime = mid - 1
		} else {
			lPrime = mid
		}
	}

	// Step 2. Perform a two pointer search among prime pairs
	lPrime = 0
	for lPrime <= rPrime {
		p, q := primes[lPrime], primes[rPrime]

		primeSum := p + q
		if primeSum > evenNumber {
			rPrime -= 1
		} else if primeSum < evenNumber {
			lPrime += 1
		} else {
			log.Printf("Found primes! (%d, %d)", p, q)
			return &GoldbachQuery{
				E: evenNumber,
				P: p,
				Q: q,
			}, nil
		}
	}

	log.Printf("did not find primes...")
	return nil, nil
}

func sanitizeGoldbachQueryInput(queryNumber int) error {
	if queryNumber < 0 {
		return fmt.Errorf("number is negative")
	}

	if queryNumber%2 == 1 {
		return fmt.Errorf("number is odd")
	}

	return nil
}

type Response struct {
	StatusCode int               `json:"statusCode"`
	Headers    map[string]string `json:"headers"`
	Body       GoldbachQuery     `json:"body"`
}

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var err error
	queryNumber := 0
	log.Println("received request")

	if request.PathParameters != nil {
		queryNumber, err = strconv.Atoi(request.PathParameters["number"])

		if err != nil {
			errBody, _ := json.Marshal(map[string]string{"error": "Invalid query number"})
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Headers: map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
				Body: string(errBody),
			}, nil
		}
	}
	log.Printf("query number: %d\n", queryNumber)

	err = sanitizeGoldbachQueryInput(queryNumber)

	var result *GoldbachQuery
	if err == nil {
		result, err = findGoldbachFactors(queryNumber)
	}

	if err == nil && result == nil {
		err = fmt.Errorf("The even number was too large to compute.")
	}

	if err != nil {
		errBody, _ := json.Marshal(map[string]string{"error": err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Headers: map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
			Body: string(errBody),
		}, nil
	}

	serializedResult, err := json.Marshal(result)
	log.Printf("serialized result: %s\n", string(serializedResult))

	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(serializedResult),
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
