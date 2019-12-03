package main

import (
	"bufio"
	"errors"
	"flag"
	"fmt"
	"io"
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
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
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

func doSslRedirect(router *gin.Engine) {
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
	}))
}

func loadMiddleware(router *gin.Engine, attachSentry bool, redirectSsl bool) {
	// Attach Sentry handler as middleware
	if attachSentry {
		attachSentryHandler(router)
	}

	if redirectSsl {
		doSslRedirect(router)
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
	db, err := gorm.Open("postgres", "dbname=gbcalc_dev sslmode=disable")
	check(err)
	defer db.Close()
	db.AutoMigrate(&GoldbachQuery{})

	// Define and parse flags
	// TODO: Move to own function. Define a Flags struct and use it instead of the individual flags separately.
	attachSentry := flag.Bool("attach-sentry", false, "Attach a Sentry handler to track errors")
	redirectSsl := flag.Bool("redirect-ssl", false, "Redirect HTTP requests to HTTPS")
	flag.Parse()

	router := gin.Default()

	loadMiddleware(router, *attachSentry, *redirectSsl)

	router.Static("/client", "./client/build")
	router.LoadHTMLFiles("./client/build/index.html")

	primes := loadPrimes()

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})

	router.GET("/test-error", func(c *gin.Context) {
		panic(errors.New("This is a test error"))
	})

	router.GET("/factor/:n", func(c *gin.Context) {
		n, err := strconv.Atoi(c.Param("n"))
		if err != nil {
			c.JSON(200, gin.H{
				"n":       c.Param("n"),
				"success": false,
				"message": "Invalid query.",
			})
		} else {
			for _, p := range primes {
				q := n - p
				if isPrime(q) {
					c.JSON(200, gin.H{
						"n":        n,
						"success":  true,
						"message":  "Successfully factorized.",
						"primeOne": p,
						"primeTwo": q,
					})
					fmt.Println("aaaaa")
					db.Create(&GoldbachQuery{
						E: uint64(n),
						P: uint64(p),
						Q: uint64(q),
					})
					fmt.Println("bbbbb")
					return
				}
			}

			c.JSON(200, gin.H{
				"n":       n,
				"success": false,
				"message": "The even number was too large.",
			})
		}
	})

	router.Run() // listen and serve on 0.0.0.0:8080
}
