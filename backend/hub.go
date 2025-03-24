package main

import (
	"sync"
)

type Hub struct {
	Clients    map[*Client]bool
	Users      map[string]*Client
	Broadcast  chan Message
	Register   chan *Client
	Unregister chan *Client
	mu         sync.Mutex
}

type Message struct {
	Type     string   `json:"type"`
	Sender   string   `json:"sender,omitempty"`
	Receiver string   `json:"receiver,omitempty"`
	Content  string   `json:"content,omitempty"`
	Users    []string `json:"users,omitempty"`
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[*Client]bool),
		Users:      make(map[string]*Client),
		Broadcast:  make(chan Message),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client] = true
			h.Users[client.Username] = client
			h.broadcastUserList()
			h.mu.Unlock()

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				delete(h.Users, client.Username)
				close(client.Send)
			}
			h.broadcastUserList()
			h.mu.Unlock()

		case message := <-h.Broadcast:
			h.mu.Lock()
			receiverClient, receiverOk := h.Users[message.Receiver]
			senderClient, senderOk := h.Users[message.Sender]
			h.mu.Unlock()

			if receiverOk {
				receiverClient.Send <- message
			}

			if senderOk && message.Receiver != message.Sender {
				senderClient.Send <- message
			}
		}
	}
}

func (h *Hub) broadcastUserList() {
	users := []string{}
	for user := range h.Users {
		users = append(users, user)
	}

	message := Message{
		Type:  "users",
		Users: users,
	}

	for client := range h.Clients {
		client.Send <- message
	}
}
