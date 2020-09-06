package main2

import (
	"fmt"
	"log"
	"os"
	"os/signal"

	"github.com/ispashayev/goldbach-calculator/internal/app"
)

func main() {
	fmt.Println("Hello, world!")
	server, err := app.Start()
	if err != nil {
		log.Fatalf("Failed to start app: %v", err)
	}

	signals := make(chan os.Signal)
	signal.Notify(signals, os.Interrupt)

	go server.Run()
	sigInt := <-signals
	log.Printf("Received SIGINT (%v), shutting down...", sigInt)
	server.ShutDown()
}
