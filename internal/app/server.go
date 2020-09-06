package app

import (
	"fmt"

	"github.com/ispashayev/goldbach-calculator/internal/dal"
)

type Server struct {
	dal    *dal.DAL
	router Router
}

func Start() (*Server, error) {
	dal, err := dal.Init()
	if err != nil {
		return nil, fmt.Errorf("Unable to estalish data access layer: %v", err)
	}

	server := Server{
		dal:    dal,
		router: getRouter(),
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

func (s *Server) ShutDown() {
	s.dal.Close()
}

func (s *Server) Run() {
	s.router.Route()
}
