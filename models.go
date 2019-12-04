package main

import (
	"github.com/jinzhu/gorm"
)

type GoldbachQuery struct {
	gorm.Model
	E            uint64 `gorm:"PRIMARY_KEY"`
	P            uint64
	Q            uint64
	TimesQueried uint64
}
