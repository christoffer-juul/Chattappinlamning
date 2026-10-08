using Microsoft.AspNetCore.SignalR;

namespace Chattappinlamning.Hubs
{
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var username = httpContext?.Request.Query["username"].ToString();

            if (string.IsNullOrWhiteSpace(username))
            {
                Context.Abort();
                return;
            }

            //Sparar användarnamnet för den aktuella anslutningen.
            Context.Items["username"] = username;

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string message)
        {
            //Hämtar användarnamnet som lagrades när klienten anslöt.
            var username = Context.Items["username"]?.ToString();

            if (string.IsNullOrWhiteSpace(username))
            {
                return;
            }

            //Extra förhindring av tomma meddelanden, finns även i chat.js.
            if (string.IsNullOrWhiteSpace(message))
            {
                return;
            }

            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }
    }
}