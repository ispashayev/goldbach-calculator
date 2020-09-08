package app

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/getsentry/sentry-go"
	sentrygin "github.com/getsentry/sentry-go/gin"
	"github.com/gin-gonic/contrib/secure"
	"github.com/gin-gonic/gin"
	"github.com/ispashayev/goldbach-calculator/internal/gbcalc"
	"github.com/ispashayev/goldbach-calculator/internal/models"
)

// Router defines an interface for various types of routers
type Router interface {
	ConfigureRoutes()
	Route()
	ShutDown()
	/* Routers must implement our middleware functions */
	attachSentryHandler()
	redirectSSL()
}

// GinRouter is an implementation of the Router interface using the gin/gonic framework
type GinRouter struct {
	router             *gin.Engine
	goldbachCalculator *gbcalc.GoldbachCalculator
}

func (gr *GinRouter) attachSentryHandler() {
	if err := sentry.Init(sentry.ClientOptions{}); err != nil {
		log.Fatalf("sentry initialization failed: %v\n", err)
	}
	gr.router.Use(sentrygin.New(sentrygin.Options{
		Repanic: true, // TODO(@ispashayev): verify if we want this
	}))
	gr.router.Use(func(c *gin.Context) {
		if hub := sentrygin.GetHubFromContext(c); hub != nil {
			hub.Flush(time.Second * 5)
		}
		c.Next()
	})
}

func (gr *GinRouter) redirectSSL() {
	gr.router.Use(secure.Secure(secure.Options{
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

type appHandlerFunc func(c *gin.Context) *models.Error

func captureErrors(fn appHandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := fn(c); err != nil {
			c.JSON(err.Status, err.Encode())
		}
	}
}

func getClientError(c *gin.Context) *models.Error {
	return &models.Error{
		Status:    http.StatusBadRequest,
		ErrorType: "testError",
		Message:   "this is a test client error",
	}
}

func getServerError(c *gin.Context) *models.Error {
	return &models.Error{
		Status:    http.StatusInternalServerError,
		ErrorType: "testError",
		Message:   "this is a test client error",
	}
}

func getServerPanic(c *gin.Context) *models.Error {
	panic("this is a test server panic")
}

func (gr *GinRouter) getGoldbachFactors(c *gin.Context) *models.Error {
	n, err := strconv.Atoi(c.Param("n"))
	if err != nil || n <= 3 || n%2 == 1 {
		return &models.Error{
			Status:    http.StatusBadRequest,
			ErrorType: "validationError",
			Message:   "queried value must be an even number greater than two",
		}
	}

	goldbachFactors, calcErr := gr.goldbachCalculator.ComputeGoldbachFactors(n)
	if calcErr != nil {
		return calcErr
	}
	c.JSON(http.StatusOK, goldbachFactors.Encode())
	return nil
}

// ConfigureRoutes sets up function handlers for the URLs that the server will accept
func (gr *GinRouter) ConfigureRoutes() {
	router := gr.router

	router.Static("/client", "./client/build")
	router.LoadHTMLFiles("./client/build/index.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})

	/* Test routes */
	router.GET("/tests/client-error", captureErrors(getClientError))
	router.GET("/tests/server-error", captureErrors(getServerError))
	router.GET("/tests/server-panic", captureErrors(getServerPanic))

	/* App routes */
	router.GET("/factor/:n", captureErrors(gr.getGoldbachFactors))
}

// Route causes the router to start handling network traffic
func (gr *GinRouter) Route() {
	gr.router.Run()
}

// ShutDown stops the consumption of resources being used by the router
func (gr *GinRouter) ShutDown() {
	gr.goldbachCalculator.ShutDown()
}

// GetGinRouter returns a struct that the server can use to process requests using the gin/gonic framework
func GetGinRouter(goldbachCalculator *gbcalc.GoldbachCalculator) *GinRouter {
	return &GinRouter{
		router:             gin.Default(),
		goldbachCalculator: goldbachCalculator,
	}
}
