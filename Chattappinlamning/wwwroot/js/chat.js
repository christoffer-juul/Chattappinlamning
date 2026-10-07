"use strict";

var connection;
var username = "";

document.getElementById("sendButton").disabled = true;
document.getElementById("messageInput").disabled = true;

document.getElementById("connectButton").addEventListener("click", function () {
    username = document.getElementById("usernameInput").value.trim();

    if (username === "") {
        alert("Du måste ange ett användarnamn.");
        return;
    }

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

function sendMessage() {
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    connection.invoke("SendMessage", message)
        .then(function () {
            messageInput.value = "";
            messageInput.focus();
        })
        .catch(function (err) {
            console.error(err.toString());
        });
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