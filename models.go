package main

import (
	"github.com/jinzhu/gorm"
)

type GoldbachQuery struct {
	gorm.Model
	e uint64
	p uint64
	q uint64
}
