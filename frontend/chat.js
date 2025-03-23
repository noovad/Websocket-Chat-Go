let ws;
let username;
const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const userList = document.getElementById("user-list");

function login() {
    username = document.getElementById("userSelect").value;
    if (!username) {
        alert("Please select a user");
        return;
    }

    ws = new WebSocket(`ws://localhost:8080/ws?username=${username}`);

    ws.onopen = () => {
        messageInput.disabled = false;
        document.querySelector("button[onclick='sendMessage()']").disabled = false;
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Update online user list
        if (data.type === "users") {
            userList.innerHTML = "";
            data.users.forEach(user => {
                const userElem = document.createElement("li");
                userElem.textContent = user;
                userList.appendChild(userElem);
            });
        }

        // Display chat messages
        if (data.type === "message") {
            const messageElem = document.createElement("li");
            messageElem.textContent = `${data.sender}: ${data.content}`;
            messages.appendChild(messageElem);
        }
    };
}

function sendMessage() {
    const message = messageInput.value;
    if (ws && message) {
        ws.send(message);
        messageInput.value = "";
    }
}