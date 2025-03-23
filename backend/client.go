package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Client struct {
	Hub      *Hub
	Conn     *websocket.Conn
	Send     chan Message
	Username string
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request, hub *Hub) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}

	username := r.URL.Query().Get("username")
	if username == "" {
		username = "Anonymous"
	}

	client := &Client{
		Hub:      hub,
		Conn:     conn,
		Send:     make(chan Message),
		Username: username,
	}

	hub.Register <- client

	go client.WriteMessages()
	go client.ReadMessages()
}

func (c *Client) WriteMessages() {
	defer c.Conn.Close()
	for message := range c.Send {
		data, _ := json.Marshal(message)
		c.Conn.WriteMessage(websocket.TextMessage, data)
	}
}

func (c *Client) ReadMessages() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		message := Message{
			Type:    "message",
			Sender:  c.Username,
			Content: string(msg),
		}

		c.Hub.Broadcast <- message
	}
}
