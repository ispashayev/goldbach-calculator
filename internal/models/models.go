package models

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type GoldbachQuery struct {
	gorm.Model
	E            uint64 `gorm:"PRIMARY_KEY"`
	P            uint64
	Q            uint64
	TimesQueried uint64
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
		"object":     "error",
		"error_type": e.ErrorType,
		"message":    e.Message,
	}
}
