let activeUser = "";
let ws;

document.getElementById("loginButton").onclick = handleAuth;

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

        ws.onmessage = handleIncomingMessage;
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
    ws = null;
    chatContainer.style.display = "none";
    chatContainer.innerHTML = "";
    const userSelect = document.getElementById("userSelect");
    const loginButton = document.getElementById("loginButton");

    userSelect.disabled = false;
    userSelect.value = "";
    loginButton.textContent = "Login";
}
