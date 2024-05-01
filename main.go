package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
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

	return primes, nil
}

func isPrime(query int) bool {
	for i := 2; i <= int(math.Sqrt(float64(query))); i++ {
		if query%i == 0 {
			return false
		}
	}
	return true
}

func findGoldbachFactors(evenNumber int) (*GoldbachQuery, error) {
	primes, err := loadPrimes()
	if err != nil {
		return nil, err
	}

	for _, p := range primes {
		q := evenNumber - p
		if isPrime(q) {
			return &GoldbachQuery{
				E: evenNumber,
				P: p,
				Q: q,
			}, nil
		}
	}

	return nil, nil
}

func sanitizeGoldbachQueryInput(queryNumber int) error {
	if queryNumber < 0 {
		return fmt.Errorf("number is negative")
	}

	if queryNumber%2 == 0 {
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

	if request.PathParameters != nil {
		queryNumber, err = strconv.Atoi(request.PathParameters["number"])

		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 400}, err
		}
	}

	err = sanitizeGoldbachQueryInput(queryNumber)

	var result *GoldbachQuery
	if err != nil {
		result, err = findGoldbachFactors(queryNumber)
	}

	var serializedResult []byte
	if err != nil {
		serializedResult, err = json.Marshal(result)
	}

	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(serializedResult),
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
