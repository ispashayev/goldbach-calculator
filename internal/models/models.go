package models

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
)

type GoldbachQuery struct {
	gorm.Model
	E            uint64 `gorm:"PRIMARY_KEY"`
	P            uint64
	Q            uint64
	TimesQueried uint64
	ComputeTime  time.Duration
}

func (gq *GoldbachQuery) Encode() map[string]interface{} {
	return map[string]interface{}{
		"object":       "goldbachQuery",
		"evenNumber":   gq.E,
		"primeOne":     gq.P,
		"primeTwo":     gq.Q,
		"timesQueried": gq.TimesQueried,
	}
}

type Error struct {
	Status    int
	ErrorType string
	Message   string
}

func (e Error) Error() string {
	return fmt.Sprintf("error: %s: %s", e.ErrorType, e.Message)
}

func (e *Error) Encode() map[string]interface{} {
	return map[string]interface{}{
		"object":    "error",
		"errorType": e.ErrorType,
		"message":   e.Message,
	}
}
