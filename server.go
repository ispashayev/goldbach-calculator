package main

import (
	"bufio"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
	"time"

	"net/http"

	"github.com/getsentry/sentry-go"
	sentrygin "github.com/getsentry/sentry-go/gin"
	"github.com/gin-gonic/contrib/secure"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func attachSentryHandler(router *gin.Engine) {
	// Initialize Sentry's handler
	if err := sentry.Init(sentry.ClientOptions{
		Dsn: os.Getenv("SENTRY_DSN"),
	}); err != nil {
		fmt.Printf("Sentry initialization failed: %v\n", err)
		panic(err)
	}

	router.Use(sentrygin.New(sentrygin.Options{
		Repanic: true,
	}))

	router.Use(func(c *gin.Context) {
		if hub := sentrygin.GetHubFromContext(c); hub != nil {
			hub.Flush(time.Second * 5)
		}
		c.Next()
	})
}

func loadMiddleware(router *gin.Engine, attachSentry bool) {
	// Attach Sentry handler as middleware
	if attachSentry {
		attachSentryHandler(router)
	}
}

func loadPrimes() (primes []int) {
	fd, err := os.Open("data/primes.dat")
	check(err)

	primesReader := io.Reader(fd)
	scanner := bufio.NewScanner(primesReader)
	scanner.Split(bufio.ScanLines)

	for scanner.Scan() {
		prime, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
		check(err)
		primes = append(primes, prime)
	}
	check(scanner.Err())
	return primes
}

func isPrime(query int) bool {
	for i := 2; i <= int(math.Sqrt(float64(query))); i++ {
		if query%i == 0 {
			return false
		}
	}
	return true
}

func main() {
	// Connect to the database, and apply data model changes (if any)
	var db *gorm.DB
	var err error
	dbUrl, dbUrlFound := os.LookupEnv("DATABASE_URL")
	if dbUrlFound {
		db, err = gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	} else {
		log.Fatal("unable to connect to database")
	}
	check(err)
	db.AutoMigrate(&GoldbachQuery{})

	// Define and parse flags
	attachSentry := flag.Bool("attach-sentry", false, "Attach a Sentry handler to track errors")
	flag.Parse()

	router := gin.Default()

	loadMiddleware(router, *attachSentry)

	router.Static("/client", "./client/build")
	router.LoadHTMLFiles("./client/build/index.html")

	primes := loadPrimes()

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})

	router.GET("/hello-world", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello World!",
		})
	})

	router.GET("/test-error", func(c *gin.Context) {
		panic(errors.New("this is a test error"))
	})

	router.GET("/factor/:n", func(c *gin.Context) {
		n, err := strconv.Atoi(c.Param("n"))
		if err != nil {
			c.JSON(200, gin.H{
				"n":       c.Param("n"),
				"success": false,
				"message": "Invalid query.",
			})
			return
		}

		var goldbachQuery GoldbachQuery
		result := db.First(&goldbachQuery, "E = ?", n)

		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// This even number has been factored before
			goldbachQuery.TimesQueried++
			db.Save(&goldbachQuery)
			c.JSON(200, gin.H{
				"n":            goldbachQuery.E,
				"success":      true,
				"message":      "Successfully found result of previous query.",
				"primeOne":     goldbachQuery.P,
				"primeTwo":     goldbachQuery.Q,
				"timesQueried": goldbachQuery.TimesQueried,
			})
			return
		}

		for _, p := range primes {
			q := n - p
			if isPrime(q) {
				db.Create(&GoldbachQuery{
					E:            uint64(n),
					P:            uint64(p),
					Q:            uint64(q),
					TimesQueried: 1,
				})
				c.JSON(200, gin.H{
					"n":            n,
					"success":      true,
					"message":      "Successfully computed Goldbach Factors.",
					"primeOne":     p,
					"primeTwo":     q,
					"timesQueried": 1,
				})
				return
			}
		}

		c.JSON(200, gin.H{
			"n":       n,
			"success": false,
			"message": "The even number was too large.",
		})
	})

	router.Use(secure.Secure(secure.Options{
		AllowedHosts:         []string{"www.goldbach.cloud", "goldbach-calculator.herokuapp.com"},
		SSLRedirect:          true,
		SSLHost:              "www.goldbach.cloud",
		SSLProxyHeaders:      map[string]string{"X-Forwarded-Proto": "https"},
		STSSeconds:           315360000,
		STSIncludeSubdomains: true,
		FrameDeny:            true,
		ContentTypeNosniff:   true,
		BrowserXssFilter:     true,
		IsDevelopment:        os.Getenv("ENVIRONMENT") == "dev",
	}))
	router.Run()
}
