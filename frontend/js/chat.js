let activeUsers = [];
const users = ["Alex", "Jeny", "Aldo", "Steven"];

function sendMessage(user) {
    const input = document.getElementById(`input-${user}`);
    const message = input.value.trim();

    if (message !== "" && ws) {
        const data = {
            content: message,
            receiver: user,
        };
        ws.send(JSON.stringify(data));
        input.value = "";
    }
}

function handleIncomingMessage(event) {
    const data = JSON.parse(event.data);

    if (data.type === "message") {
        displayMessage(data);
    }

    if (data.type === "users") {
        activeUsers = data.users;
        updateChatHeaders();
    }
}
