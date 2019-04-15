package main

import (
  "bufio"
  "io"
  "os"
  "strconv"
  "strings"

  "net/http"

  "github.com/gin-gonic/gin"
)

func check(err error) {
  if (err != nil) {
    panic(err)
  }
}

func main() {
  router := gin.Default()

  router.Static("/client", "./client/build")
  router.LoadHTMLFiles("./client/build/index.html")

  fd, err := os.Open("data/primes.dat")
  check(err)

  primesReader := io.Reader(fd)
  scanner := bufio.NewScanner(primesReader)
  scanner.Split(bufio.ScanLines)

  var primes []int
  for scanner.Scan() {
    prime, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
    check(err)
    primes = append(primes, prime)
  }
  check(scanner.Err())

  router.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", gin.H{})
  })

  router.GET("/factor/:n", func(c *gin.Context) {
    n, err := strconv.Atoi(c.Param("n"))
    if err != nil {
      c.JSON(200, gin.H{
        "n": c.Param("n"),
        "success": false,
        "message": "invalid query",
      })
    } else {
      found, g, h := false, -1, -1
      for i := 0; i < len(primes); i++ {
        if found {
          break
        }
        for j := i; j < len(primes); j++ {
          if primes[i] + primes[j] == n {
            g = primes[i]
            h = primes[j]
            found = true
            break
          }
        }
      }

      c.JSON(200, gin.H{
        "n": n,
        "success": true,
        "message": "successfully factorized",
        "primeOne": g,
        "primeTwo": h,
      })
    }
  })

  router.Run() // listen and server on 0.0.0.0:8080
}
