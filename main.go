package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"math"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Number int `json:"number"`
}

type GoldbachQuery struct {
	E int `json:"E"`
	P int `json:"P"`
	Q int `json:"Q"`
}

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func loadPrimes() (primes []int) {
	fd, err := os.Open("data/primes.dat")
	check(err)

	primesReader := io.Reader(fd)
	scanner := bufio.NewScanner(primesReader)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		prime, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
		check(err)
		primes = append(primes, prime)
	}
	check(scanner.Err())
	return primes
}

func isPrime(query int) bool {
	for i := 2; i <= int(math.Sqrt(float64(query))); i++ {
		if query%i == 0 {
			return false
		}
	}
	return true
}

func findGoldbachFactors(evenNumber int) *GoldbachQuery {
	primes := loadPrimes()

	for _, p := range primes {
		q := evenNumber - p
		if isPrime(q) {
			return &GoldbachQuery{
				E: evenNumber,
				P: p,
				Q: q,
			}
		}
	}

	return nil
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

func generateResponse(goldbachQuery *GoldbachQuery, err error) *Response {
	var statusCode int
	if err != nil {
		statusCode = 400
	} else {
		statusCode = 200
	}

	headers := map[string]string{"Content-Type": "application/json"}

	return &Response{
		StatusCode: statusCode,
		Headers:    headers,
		Body:       *goldbachQuery,
	}

}

func HandleRequest(ctx context.Context, event *Event) (*Response, error) {
	if event == nil {
		return nil, fmt.Errorf("received nil event")
	}

	queryNumber := event.Number
	err := sanitizeGoldbachQueryInput(queryNumber)

	var result *GoldbachQuery
	if err != nil {
		result = findGoldbachFactors(queryNumber)
	} else {
		result = &GoldbachQuery{0, 0, 0}
	}

	return generateResponse(result, err), err
}

func main() {
	lambda.Start(HandleRequest)
}
