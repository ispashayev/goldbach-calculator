package app

import "flag"

type Config struct {
	AttachSentry bool
	RedirectSSL  bool
}

func readCmdConfig() Config {
	attachSentry := flag.Bool("attach-sentry", false, "Attach a Sentry handler to track errors")
	redirectSSL := flag.Bool("redirect-ssl", false, "Redirect HTTP requests to HTTPS")
	flag.Parse()
	return Config{
		AttachSentry: *attachSentry,
		RedirectSSL:  *redirectSSL,
	}
}

func (s *Server) attachSentry() {
	s.router.attachSentryHandler()
}

func (s *Server) redirectSSL() {
	s.router.redirectSSL()
}
