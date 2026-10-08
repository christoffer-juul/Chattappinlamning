"use strict";

var connection;
var username = "";

//Inaktivera skicka-knappen och meddelande-input tills användaren är ansluten
document.getElementById("sendButton").disabled = true;
document.getElementById("messageInput").disabled = true;

document.getElementById("connectButton").addEventListener("click", function () {
    username = document.getElementById("usernameInput").value.trim();

    const usernameError = document.getElementById("usernameError");
    
    // Kontrollera att man angivit ett användarnamn
    if (username === "") {
        usernameError.textContent = "Du måste ange ett användarnamn.";
        return;
    }

    usernameError.textContent = "";

    //Skapar en ny SignalR-anslutning med användarnamnet som en query-parameter till ChatHuben.
    connection = new signalR.HubConnectionBuilder()
        .withUrl("/chatHub?username=" + encodeURIComponent(username))
        .build();

    //Lyssnar på ReceiveMessage-metoden som skickas från servern
    connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");

    li.textContent = `${user}: ${message}`;

    document.getElementById("messagesList").appendChild(li);
    });

    //Startar SignalR-anslutningen.
    connection.start()
        .then(function () {

            console.log("SignalR Connected.");

            //Döljer login-formuläret och visar chatten när anslutningen lyckas.
            document.getElementById("loginContainer").classList.add("hidden");
            document.getElementById("chatContainer").classList.remove("hidden");

            //Aktiverar chattfunktionerna efter lyckad anslutning.
            document.getElementById("sendButton").disabled = false;
            document.getElementById("messageInput").disabled = false;

        })
        .catch(function (err) {
            console.error(err.toString());
        });
});

//Skickar meddelandet till ChatHuben via SignalR.
async function sendMessage() {
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value.trim();
    var chatError = document.getElementById("chatError");
    
    //Förhindrar tomma meddelanden från att skickas.
    if (message === "") {
        return;
    }

    try {
        await connection.invoke("SendMessage", message);

        //Tömmer inputfältet och behåller focus på det efter att meddelandet skickats.
        messageInput.value = "";
        messageInput.focus();
        chatError.textContent = "";
    }
    catch (err) {
        //Visar ett felmeddelande om meddelandet inte kunde skickas.
        console.error(err.toString());
        chatError.textContent = "Meddelandet kunde inte skickas.";
    }
}

//Skickar meddelandet när användaren klickar på skicka-knappen eller trycker på Enter.
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