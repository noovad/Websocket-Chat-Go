const chatContainer = document.getElementById("chatContainer");

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
            if (event.key === "Enter") sendMessage(user);
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

function displayMessage(data) {
    const chatContent = document.getElementById(
        data.receiver === activeUser ? `chatContent-${data.sender}` : `chatContent-${data.receiver}`
    );

    const messageElement = document.createElement("p");
    messageElement.textContent = data.content;
    messageElement.classList.add("message", data.sender === activeUser ? "right" : "left");
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight;
}
