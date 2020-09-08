package dal

import "fmt"

// ErrGoldbachFactorsNotFound generates an error message for a missing query
func ErrGoldbachFactorsNotFound(evenNumber int) error {
	return fmt.Errorf("goldbach factors not found for even number: %d", evenNumber)
}
