package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

db, err := gorm.Open("postgres", "dbname=gbcalc_dev sslmode=disable")
check(err)
defer db.Close()

db.AutoMigrate(&GoldbachQuery{})
