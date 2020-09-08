package dal

import (
	"fmt"
	"os"
	"time"

	"github.com/ispashayev/goldbach-calculator/internal/models"
	"github.com/jinzhu/gorm"
)

// DAL defines an interface for accessing a data store required by the goldbach calculator
type DAL interface {
	Close()
	GetGoldbachFactorsQuery(evenNumber int) (*models.GoldbachQuery, error)
	CreateGoldbachFactorsQuery(evenNumber int, primeOne int, primeTwo int, computeTime time.Duration) (*models.GoldbachQuery, error)
	IncrementGoldbachFactorsQueryCount(goldbachQuery *models.GoldbachQuery) (*models.GoldbachQuery, error)
}

// Postgres is an implementation of the DAL interface using a Postgres database
type Postgres struct {
	postgres *gorm.DB
}

// GetPostgresDAL configures a connection to the Postgres database. No need to set up a connection
// pool because there's only one web worker and I've already over-engineered this enough
func GetPostgresDAL() (*Postgres, error) {
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
	return &Postgres{
		postgres: db,
	}, nil
}

// Close closes the connection to the Postgres database - used for gracefully shutting down server
func (pg *Postgres) Close() {
	pg.Close()
}

func (pg *Postgres) GetGoldbachFactorsQuery(evenNumber int) (*models.GoldbachQuery, error) {
	var goldbachQuery models.GoldbachQuery
	result := pg.postgres.First(&goldbachQuery, "E = ?", evenNumber)
	if result.RecordNotFound() {
		return nil, ErrGoldbachFactorsNotFound(evenNumber)
	}
	return &goldbachQuery, nil
}

func (pg *Postgres) CreateGoldbachFactorsQuery(evenNumber int, primeOne int, primeTwo int, computeTime time.Duration) (*models.GoldbachQuery, error) {
	goldbachQuery := models.GoldbachQuery{
		E:            uint64(evenNumber),
		P:            uint64(primeOne),
		Q:            uint64(primeTwo),
		TimesQueried: 1,
		ComputeTime:  computeTime,
	}
	pg.postgres.Create(&goldbachQuery)
	return &goldbachQuery, nil
}

func (pg *Postgres) IncrementGoldbachFactorsQueryCount(goldbachQuery *models.GoldbachQuery) (*models.GoldbachQuery, error) {
	goldbachQuery.TimesQueried++
	pg.postgres.Save(goldbachQuery)
	return goldbachQuery, nil
}
