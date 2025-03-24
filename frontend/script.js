let activeUser = "";
let activeUsers = [];
let ws;
const users = ["Alex", "Jeny", "Aldo", "Steven"];
const chatContainer = document.getElementById("chatContainer");

function handleAuth() {
    const loginButton = document.getElementById("loginButton");
    const userSelect = document.getElementById("userSelect");

    if (loginButton.textContent === "Login") {
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
            userSelect.disabled = true;
            loginButton.textContent = "Logout";
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "message") {
                displayMessage(data);
            }

            if (data.type === "users") {
                activeUsers = data.users;
                updateChatHeaders();
            }
        };

        ws.onclose = () => {
            alert("Disconnected from server.");
            resetUI();
        };
    } else {
        ws.close();
        resetUI();
    }
}

function resetUI() {
    activeUser = "";
    chatContainer.style.display = "none";
    chatContainer.innerHTML = "";
    const userSelect = document.getElementById("userSelect");
    const loginButton = document.getElementById("loginButton");

    userSelect.disabled = false;
    userSelect.value = "";
    loginButton.textContent = "Login";
}

function displayChatBoxes() {
    const otherUsers = users.filter(user => user !== activeUser);

    otherUsers.forEach(user => {
        const chatBox = document.createElement("div");
        chatBox.className = "chat-box";

        const header = document.createElement("h3");
        header.id = `header-${user}`;
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

    updateChatHeaders();
}

function updateChatHeaders() {
    users.forEach(user => {
        if (user === activeUser) return;

        const header = document.getElementById(`header-${user}`);
        const input = document.getElementById(`input-${user}`);
        const sendButton = input?.nextSibling;

        if (header) {
            if (activeUsers.includes(user)) {
                header.innerHTML = `Chat with ${user} <span style="color: green;">(Online)</span>`;
                input.disabled = false;
                sendButton.disabled = false;
            } else {
                header.innerHTML = `Chat with ${user} <span style="color: red;">(Offline)</span>`;
                input.disabled = true;
                sendButton.disabled = true;
            }
        }
    });
}

function sendMessage(user) {
    const input = document.getElementById(`input-${user}`);
    const message = input.value.trim();

    if (message !== "") {
        const data = {
            content: message,
            receiver: user
        };
        ws.send(JSON.stringify(data));
        input.value = "";
    }
}

function displayMessage(data) {
    if (data.receiver === activeUser) {
        const chatContentReceiver = document.getElementById(`chatContent-${data.sender}`);
        const messageElementReceiver = document.createElement("p");
        messageElementReceiver.textContent = data.content;
        messageElementReceiver.classList.add("message", "left");
        chatContentReceiver.appendChild(messageElementReceiver);
        chatContentReceiver.scrollTop = chatContentReceiver.scrollHeight;
    }

    if (data.sender === activeUser) {
        const chatContentSender = document.getElementById(`chatContent-${data.receiver}`);
        const messageElementSender = document.createElement("p");
        messageElementSender.textContent = data.content;
        messageElementSender.classList.add("message", "right");
        chatContentSender.appendChild(messageElementSender);
        chatContentSender.scrollTop = chatContentSender.scrollHeight;
    }
}
