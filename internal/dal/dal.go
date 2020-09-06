package dal

import (
	"fmt"
	"os"

	"github.com/ispashayev/goldbach-calculator/internal/models"
	"github.com/jinzhu/gorm"
)

type DAL struct {
	postgres *gorm.DB
}

func Init() (*DAL, error) {
	var db *gorm.DB
	var err error
	dbURL, dbURLFound := os.LookupEnv("DATABASE_URL")
	if dbURLFound {
		db, err = gorm.Open("postgres", dbURL)
	} else {
		db, err = gorm.Open("postgres", "dbname=gbcalc_dev sslmode=disable")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}
	db.AutoMigrate(&models.GoldbachQuery{})
	return &DAL{
		postgres: db,
	}, nil
}

func (dal *DAL) Close() {
	dal.postgres.Close()
}
