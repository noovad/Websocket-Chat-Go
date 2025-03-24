let activeUser = "";
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

    if (message !== "") {
        const chatContent = document.getElementById(`chatContent-${user}`);

        const messageElement = document.createElement("p");
        messageElement.innerHTML = `<strong>${activeUser}:</strong> ${message}`;
        chatContent.appendChild(messageElement);

        chatContent.scrollTop = chatContent.scrollHeight;

        input.value = "";
    }
}
