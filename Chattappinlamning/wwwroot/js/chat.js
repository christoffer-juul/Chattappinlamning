"use strict";

var connection;
var username = "";

document.getElementById("sendButton").disabled = true;
document.getElementById("messageInput").disabled = true;

document.getElementById("connectButton").addEventListener("click", function () {
    username = document.getElementById("usernameInput").value.trim();

    const usernameError = document.getElementById("usernameError");

    if (username === "") {
        usernameError.textContent = "Du måste ange ett användarnamn.";
        return;
    }

    usernameError.textContent = "";

    connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub?username=" + encodeURIComponent(username))
        .build();

    connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");

    li.textContent = `${user}: ${message}`;

    document.getElementById("messagesList").appendChild(li);
    });

    connection.start()
        .then(function () {

            console.log("SignalR Connected.");

            document.getElementById("loginContainer").classList.add("hidden");
            document.getElementById("chatContainer").classList.remove("hidden");

            document.getElementById("sendButton").disabled = false;
            document.getElementById("messageInput").disabled = false;

        })
        .catch(function (err) {
            console.error(err.toString());
        });
});

async function sendMessage() {
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value.trim();
    var chatError = document.getElementById("chatError");

    if (message === "") {
        return;
    }

    try {
        await connection.invoke("SendMessage", message);
        messageInput.value = "";
        messageInput.focus();
        chatError.textContent = "";
    }
    catch (err) {
        console.error(err.toString());
        chatError.textContent = "Meddelandet kunde inte skickas.";
    }
}

document.getElementById("sendButton").addEventListener("click", function (event) {
    event.preventDefault();
    sendMessage();
});

document.getElementById("messageInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});