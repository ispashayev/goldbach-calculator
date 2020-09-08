package gbcalc

import "math"

func GetClientError() {}

func GetServerError() {}

func GetServerPanic() {
	panic("This is a test server panic")
}

func isPrime(query int) bool {
	for i := 2; i < int(math.Sqrt(float64(query))); i++ {
		if query%i == 0 {
			return false
		}
	}
	return true
}
