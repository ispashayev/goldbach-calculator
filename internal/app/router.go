package app

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ispashayev/goldbach-calculator/internal/models"
)

type Router interface {
	ConfigureRoutes()
	Route()
}

type GinRouter struct {
	router *gin.Engine
}

type appHandlerFunc func(c *gin.Context) *models.Error

func captureErrors(fn appHandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := fn(c); err != nil {
			c.JSON(err.Status, err.Encode)
		}
	}
}

func getClientError(c *gin.Context) *models.Error {
	return &models.Error{
		Status:    http.StatusBadRequest,
		ErrorType: "test_error",
		Message:   "this is a test client error",
	}
}

func getServerError(c *gin.Context) *models.Error {
	return &models.Error{
		Status:    http.StatusInternalServerError,
		ErrorType: "test_error",
		Message:   "this is a test client error",
	}
}

func getServerPanic(c *gin.Context) *models.Error {
	panic("this is a test server panic")
}

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
}

func (gr *GinRouter) Route() {
	gr.router.Run()
}

func getRouter() *GinRouter {
	return &GinRouter{
		router: gin.Default(),
	}
}
