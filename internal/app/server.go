package app

import (
	"fmt"

	"github.com/ispashayev/goldbach-calculator/internal/dal"
	"github.com/ispashayev/goldbach-calculator/internal/gbcalc"
)

// Server is a struct used to process user requests
type Server struct {
	router Router
	gbcalc *gbcalc.GoldbachCalculator
}

// Start initializes and returns a server
func Start() (*Server, error) {
	dal, err := dal.GetPostgresDAL()
	if err != nil {
		return nil, fmt.Errorf("Unable to estalish data access layer: %v", err)
	}

	gbcalc := gbcalc.GetGoldbachCalculator(dal)

	server := Server{
		router: GetGinRouter(gbcalc),
		gbcalc: gbcalc,
	}

	config := readCmdConfig()
	if config.AttachSentry {
		server.attachSentry()
	}
	if config.RedirectSSL {
		server.redirectSSL()
	}

	return &server, nil
}

// ShutDown stops the consumption of resources being used by the server
func (s *Server) ShutDown() {
	s.router.ShutDown()
}

// Run starts the server so that it can process incoming requests
func (s *Server) Run() {
	s.router.Route()
}
