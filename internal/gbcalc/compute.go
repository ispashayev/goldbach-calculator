package gbcalc

import (
	"bufio"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ispashayev/goldbach-calculator/internal/dal"
	"github.com/ispashayev/goldbach-calculator/internal/models"
)

// GoldbachCalculator defines a struct used for calculating the goldbach factors of an even number
type GoldbachCalculator struct {
	dal    dal.DAL
	primes []int
}

// GetGoldbachCalculator initialized and returns an instance of a goldbach calculator
func GetGoldbachCalculator(dal dal.DAL) *GoldbachCalculator {
	// first load the primes into memory
	fd, err := os.Open("data/primes.dat")
	if err != nil {
		log.Fatalf("unable to load primes into memory: %v", err)
	}

	primesReader := io.Reader(fd)
	scanner := bufio.NewScanner(primesReader)
	scanner.Split(bufio.ScanLines)

	var primes []int
	for scanner.Scan() {
		prime, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
		if err != nil {
			log.Fatalf("error loading prime into memory: %v", err)
		}
		primes = append(primes, prime)
	}

	if err = scanner.Err(); err != nil {
		log.Fatalf("error loading primes into memory: %v", err)
	}

	return &GoldbachCalculator{
		primes: primes,
		dal:    dal,
	}
}

// ComputeGoldbachFactors computes the two primes whose sum is equal to the supplied even number. The result is
// saved for future queries, so if there's a pre-computed result, then its query count is incremented and then returned
func (gc *GoldbachCalculator) ComputeGoldbachFactors(evenNumber int) (*models.GoldbachQuery, *models.Error) {
	precomputedGoldbachFactorsQuery, err := gc.dal.GetGoldbachFactorsQuery(evenNumber)
	if err != nil && err != dal.ErrGoldbachFactorsNotFound(evenNumber) {
		log.Printf("error while querying for precomputed goldbach factors: %v", err)
		return nil, &models.Error{
			Status:    http.StatusInternalServerError,
			ErrorType: "serverError",
			Message:   "unexpected error while querying for precomputed goldbach factors",
		}
	}

	if precomputedGoldbachFactorsQuery != nil {
		precomputedGoldbachFactorsQuery, err = gc.dal.IncrementGoldbachFactorsQueryCount(precomputedGoldbachFactorsQuery)
		if err != nil {
			log.Printf("error while incrementing query count for precomputed goldbach factors: %v", err)
			return nil, &models.Error{
				Status:    http.StatusInternalServerError,
				ErrorType: "serverError",
				Message:   "error while incrementing query count for precomputed goldbach factors",
			}
		}
		return precomputedGoldbachFactorsQuery, nil
	}

	startTime := time.Now()
	for _, p := range gc.primes {
		q := evenNumber - p
		if isPrime(q) {
			endTime := time.Now()
			computeTime := endTime.Sub(startTime)
			goldbachQuery, err := gc.dal.CreateGoldbachFactorsQuery(evenNumber, p, q, computeTime)
			if err != nil {
				log.Printf("error storing computed goldbach factors in database: %v", err)
				return nil, &models.Error{
					Status:    http.StatusInternalServerError,
					ErrorType: "serverError",
					Message:   "error while saving computed goldbach factors for future queries",
				}
			}
			return goldbachQuery, nil
		}
	}

	return nil, &models.Error{
		Status:    http.StatusUnprocessableEntity,
		ErrorType: "computeError",
		Message:   "the even number was too large",
	}
}

// ShutDown stops the consumption of resources being used by the goldbach calculator
func (gc *GoldbachCalculator) ShutDown() {
	gc.dal.Close()
}
