"use strict";

var connection;
var username = "";

document.getElementById("sendButton").disabled = true;

document.getElementById("connectButton").addEventListener("click", function () {
    username = document.getElementById("usernameInput").value.trim();

    if (username === "") {
        alert("Du måste ange ett användarnamn.");
        return;
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub?username=" + encodeURIComponent(username))
        .build();

    connection.start()
        .then(function () {

            console.log("SignalR Connected.");

            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("chatContainer").style.display = "block";

            document.getElementById("sendButton").disabled = false;

        })
        .catch(function (err) {
            console.error(err.toString());
        });
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value.trim();

    if (message === "") {
        return;
    }

    connection.invoke("SendMessage", message)
        .catch(function (err) {
            console.error(err.toString());
        });
    
    document.getElementById("messageInput").value = "";

    event.preventDefault();
});

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");

    li.textContent = `${user}: ${message}`;

    document.getElementById("messagesList").appendChild(li);
});