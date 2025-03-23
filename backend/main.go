package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var hub *Hub

func main() {
	hub = NewHub()
	go hub.Run()

	r := gin.Default()
	r.Static("/static", "../frontend")

	r.LoadHTMLFiles("../frontend/index.html")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	r.GET("/ws", func(c *gin.Context) {
		HandleWebSocket(c.Writer, c.Request, hub)
	})

	r.Run(":8080")
}
