let activeUser = "";
let ws;
const users = ["Alex", "Jeny", "Aldo", "Steven"];
const chatContainer = document.getElementById("chatContainer");

function login() {
    const userSelect = document.getElementById("userSelect");
    activeUser = userSelect.value;
    if (!activeUser) {
        alert("Pilih user untuk login!");
        return;
    }
    ws = new WebSocket(`ws://localhost:8080/ws?username=${activeUser}`);
    ws.onopen = () => {
        chatContainer.style.display = "flex";
        chatContainer.innerHTML = "";
        displayChatBoxes();
    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
            displayMessage(data);
        }
    };
}

function displayChatBoxes() {
    const otherUsers = users.filter(user => user !== activeUser);

    otherUsers.forEach(user => {
        const chatBox = document.createElement("div");
        chatBox.className = "chat-box";

        const header = document.createElement("h3");
        header.textContent = `Chat with ${user}`;
        chatBox.appendChild(header);

        const chatContent = document.createElement("div");
        chatContent.className = "chat-content";
        chatContent.id = `chatContent-${user}`;
        chatBox.appendChild(chatContent);

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "input-wrapper";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Type a message to ${user}...`;
        input.value = "Test";
        input.id = `input-${user}`;
        input.onkeydown = (event) => {
            if (event.key === "Enter") {
                sendMessage(user);
            }
        };

        const sendButton = document.createElement("button");
        sendButton.textContent = "Send";
        sendButton.onclick = () => sendMessage(user);

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(sendButton);

        chatBox.appendChild(inputWrapper);

        chatContainer.appendChild(chatBox);
    });
}

function sendMessage(user) {
    const input = document.getElementById(`input-${user}`);
    const message = input.value.trim();
    if (message != "") {
        if (ws && message) {
            const data = {
                content: message,
                receiver: user
            };

            ws.send(JSON.stringify(data));
            input.value = "Test";
        }
    }
}

function displayMessage(data) {
    if (data.receiver === activeUser) {
        const chatContentReceiver = document.getElementById(`chatContent-${data.sender}`);
        const messageElementReceiver = document.createElement("p");
        messageElementReceiver.innerHTML = `<strong>${data.sender}:</strong> ${data.content}`;
        chatContentReceiver.appendChild(messageElementReceiver);
        chatContentReceiver.scrollTop = chatContentReceiver.scrollHeight;
    }

    if (data.sender === activeUser) {
        const chatContentSender = document.getElementById(`chatContent-${data.receiver}`);
        const messageElementSender = document.createElement("p");
        messageElementSender.innerHTML = `<strong>You:</strong> ${data.content}`;
        chatContentSender.appendChild(messageElementSender);
        chatContentSender.scrollTop = chatContentSender.scrollHeight;
    }
}
