package main

import (
  "bufio"
  "io"
  "math"
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
    if query % i == 0 {
      return false
    }
  }
  return true
}

func main() {
  router := gin.Default()

  router.Static("/client", "./client/build")
  router.LoadHTMLFiles("./client/build/index.html")

  primes := loadPrimes()

  router.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", gin.H{})
  })

  router.GET("/factor/:n", func(c *gin.Context) {
    n, err := strconv.Atoi(c.Param("n"))
    if err != nil {
      c.JSON(200, gin.H{
        "n": c.Param("n"),
        "success": false,
        "message": "Invalid query.",
      })
    } else {
      for _, p := range primes {
        q := n - p
        if isPrime(q) {
          c.JSON(200, gin.H{
            "n": n,
            "success": true,
            "message": "Successfully factorized.",
            "primeOne": p,
            "primeTwo": q,
          })
          return
        }
      }

      c.JSON(200, gin.H{
        "n": n,
        "success": false,
        "message": "The even number was too large.",
      })
    }
  })

  router.Run() // listen and serve on 0.0.0.0:8080
}
